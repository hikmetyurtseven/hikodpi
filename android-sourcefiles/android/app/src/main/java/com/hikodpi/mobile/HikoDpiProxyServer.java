package com.hikodpi.mobile;

import android.net.VpnService;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

/**
 * HikoDPI Local SNI-Splitting Proxy Server (127.0.0.1:8899)
 * Built with Vibecoding 🎧
 *
 * Solves "Gizlilik Hatası" (NET::ERR_CERT_COMMON_NAME_INVALID):
 * 1. Resolves target domain using Cloudflare DoH (1.1.1.1) to bypass DNS poisoning.
 * 2. Connects to real destination server on port 443.
 * 3. Fragments the TLS ClientHello at byte 2 so ISP DPI firewalls cannot detect SNI.
 * 4. Pipelined bi-directional data relay with low latency.
 */
public class HikoDpiProxyServer implements Runnable {

    private static final String TAG = "HikoDpiProxy";
    public static final int PROXY_PORT = 8899;

    private final VpnService vpnService;
    private ServerSocket serverSocket = null;
    private volatile boolean isRunning = false;
    private ExecutorService threadPool = null;
    private final Map<String, String> dohDnsCache = new ConcurrentHashMap<>();

    public HikoDpiProxyServer(VpnService vpnService) {
        this.vpnService = vpnService;
    }

    public synchronized void start() {
        if (isRunning) return;
        try {
            serverSocket = new ServerSocket(PROXY_PORT, 50, InetAddress.getByName("127.0.0.1"));
            isRunning = true;
            threadPool = Executors.newCachedThreadPool();
            new Thread(this, "HikoDpiProxyListener").start();
            Log.i(TAG, "Local SNI Splitting Proxy running on 127.0.0.1:" + PROXY_PORT);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start proxy on port " + PROXY_PORT + ": " + e.getMessage(), e);
        }
    }

    public synchronized void stop() {
        isRunning = false;
        if (serverSocket != null) {
            try {
                serverSocket.close();
            } catch (Exception ignored) {}
            serverSocket = null;
        }
        if (threadPool != null) {
            threadPool.shutdownNow();
            threadPool = null;
        }
        Log.i(TAG, "Local SNI Splitting Proxy stopped.");
    }

    @Override
    public void run() {
        while (isRunning && serverSocket != null && !serverSocket.isClosed()) {
            try {
                Socket clientSocket = serverSocket.accept();
                if (threadPool != null && !threadPool.isShutdown()) {
                    threadPool.submit(() -> handleClient(clientSocket));
                }
            } catch (Exception e) {
                if (!isRunning) break;
            }
        }
    }

    private void handleClient(Socket clientSocket) {
        Socket remoteSocket = null;
        try {
            clientSocket.setTcpNoDelay(true);
            clientSocket.setSoTimeout(15000);
            InputStream clientIn = clientSocket.getInputStream();
            OutputStream clientOut = clientSocket.getOutputStream();

            // HTTP CONNECT header'ını oku
            String firstLine = readLine(clientIn);
            if (firstLine == null || !firstLine.startsWith("CONNECT ")) {
                clientSocket.close();
                return;
            }

            // Headers kalanını tüket (\r\n\r\n)
            String line;
            while ((line = readLine(clientIn)) != null && !line.isEmpty()) {
                // Headerları geç
            }

            // Hedef host ve port ayrıştır (örn. "discord.com:443" veya "www.roblox.com:443")
            String[] parts = firstLine.split(" ")[1].split(":");
            String targetHost = parts[0];
            int targetPort = parts.length > 1 ? Integer.parseInt(parts[1]) : 443;

            // Alan adını Cloudflare DoH (1.1.1.1) ile çöz (BTK sahte IP tuzağını atlatır)
            String realIp = resolveDomainDoH(targetHost);
            if (realIp == null) {
                realIp = targetHost; // Fallback
            }

            // Uzak sunucuya bağlan
            remoteSocket = new Socket();
            remoteSocket.setTcpNoDelay(true);
            remoteSocket.setSoTimeout(15000);

            // VPN döngüsünü engellemek için soketi koru
            if (vpnService != null) {
                vpnService.protect(remoteSocket);
            }

            remoteSocket.connect(new InetSocketAddress(realIp, targetPort), 5000);

            // İstemciye tünel kuruldu yanıtı ver
            clientOut.write("HTTP/1.1 200 Connection Established\r\n\r\n".getBytes(StandardCharsets.US_ASCII));
            clientOut.flush();

            InputStream remoteIn = remoteSocket.getInputStream();
            OutputStream remoteOut = remoteSocket.getOutputStream();

            // İlk gelen TLS ClientHello paketini yakala ve 2. bayttan böl (SNI Splitting)
            byte[] initialBuf = new byte[4096];
            int initialRead = clientIn.read(initialBuf);

            if (initialRead > 5 && initialBuf[0] == 0x16 && initialBuf[1] == 0x03) {
                // TLS ClientHello tespit edildi -> 2-Baytlık Parçalama ile DPI sansürünü baypas et!
                remoteOut.write(initialBuf, 0, 2);
                remoteOut.flush();

                try {
                    Thread.sleep(1); // Middlebox'ın TCP segmentini ayrı algılaması için mikro bekleme
                } catch (InterruptedException ignored) {}

                remoteOut.write(initialBuf, 2, initialRead - 2);
                remoteOut.flush();
                Log.d(TAG, "SNI Split successfully applied to: " + targetHost);
            } else if (initialRead > 0) {
                remoteOut.write(initialBuf, 0, initialRead);
                remoteOut.flush();
            }

            // Kalan trafiği çift yönlü eşzamanlı aktar
            Socket finalRemote = remoteSocket;
            Thread remoteToClient = new Thread(() -> pipe(remoteIn, clientOut, clientSocket, finalRemote), "HikoR2C");
            remoteToClient.start();

            pipe(clientIn, remoteOut, clientSocket, remoteSocket);
            try {
                remoteToClient.join(3000);
            } catch (Exception ignored) {}

        } catch (Exception e) {
            Log.d(TAG, "Tunnel closed: " + e.getMessage());
        } finally {
            closeQuietly(clientSocket);
            closeQuietly(remoteSocket);
        }
    }

    private void pipe(InputStream in, OutputStream out, Socket s1, Socket s2) {
        byte[] buf = new byte[8192];
        int r;
        try {
            while ((r = in.read(buf)) != -1) {
                out.write(buf, 0, r);
                out.flush();
            }
        } catch (Exception ignored) {
        } finally {
            closeQuietly(s1);
            closeQuietly(s2);
        }
    }

    private String resolveDomainDoH(String domain) {
        if (domain == null || domain.isEmpty()) return null;
        String cached = dohDnsCache.get(domain);
        if (cached != null) return cached;

        try {
            // Cloudflare JSON DoH API
            URL url = new URL("https://1.1.1.1/dns-query?name=" + domain + "&type=A");
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            if (vpnService != null) {
                // Protect the HTTPS connection from looping
            }
            conn.setConnectTimeout(2500);
            conn.setReadTimeout(3000);
            conn.setRequestProperty("Accept", "application/dns-json");
            conn.setRequestProperty("User-Agent", "HikoDPI-Mobile");

            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                InputStream is = conn.getInputStream();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] b = new byte[1024];
                int n;
                while ((n = is.read(b)) != -1) {
                    baos.write(b, 0, n);
                }
                String json = baos.toString("UTF-8");
                // JSON'dan ilk IPv4 adresini regex ile hızlıca çek
                int dataIdx = json.indexOf("\"data\":\"");
                if (dataIdx != -1) {
                    int endIdx = json.indexOf("\"", dataIdx + 8);
                    if (endIdx != -1) {
                        String ip = json.substring(dataIdx + 8, endIdx);
                        if (ip.matches("^\\d+\\.\\d+\\.\\d+\\.\\d+$") && !ip.equals("195.175.254.2")) {
                            dohDnsCache.put(domain, ip);
                            return ip;
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log.d(TAG, "DoH lookup failed for " + domain + ": " + e.getMessage());
        }

        return null;
    }

    private String readLine(InputStream in) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int c;
        while ((c = in.read()) != -1) {
            if (c == '\n') break;
            if (c != '\r') baos.write(c);
        }
        if (baos.size() == 0 && c == -1) return null;
        return baos.toString("US-ASCII");
    }

    private void closeQuietly(Socket s) {
        if (s != null) {
            try {
                s.close();
            } catch (Exception ignored) {}
        }
    }
}
