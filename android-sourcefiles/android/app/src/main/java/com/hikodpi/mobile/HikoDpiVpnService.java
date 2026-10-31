package com.hikodpi.mobile;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.ProxyInfo;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

/**
 * HikoDPI Mobile - High-Performance Android DoH & SNI-Splitting VpnService
 * Built with Vibecoding 🎧
 *
 * Solves:
 * 1. "Gizlilik Hatası" (NET::ERR_CERT_COMMON_NAME_INVALID) via 2-byte SNI splitting local proxy.
 * 2. DNS Poisoning via Cloudflare DoH (1.1.1.1).
 * 3. Shows prominent interactive notification with live chronometer and control buttons.
 */
public class HikoDpiVpnService extends VpnService implements Runnable {

    private static final String TAG = "HikoDpiVpn";
    private static final String CHANNEL_ID = "hikodpi_active_channel_v3";
    private static final int NOTIFICATION_ID = 8899;

    public static final String ACTION_STOP = "com.hikodpi.mobile.STOP";
    public static final String ACTION_RESTART = "com.hikodpi.mobile.RESTART";

    private static final String VIRTUAL_CLIENT_IP = "10.254.1.1";
    private static final String VIRTUAL_DNS_IP = "10.254.1.2";

    private static volatile boolean isRunning = false;
    private static volatile long startTimeMillis = 0;
    private static volatile String currentPreset = "Discord & Roblox Mobil";

    private ParcelFileDescriptor vpnInterface = null;
    private Thread workerThread = null;
    private ExecutorService dnsExecutor = null;
    private HikoDpiProxyServer proxyServer = null;
    private final Map<String, byte[]> dnsCache = new ConcurrentHashMap<>();

    public static boolean isServiceRunning() {
        return isRunning;
    }

    public static long getUptimeSeconds() {
        if (!isRunning || startTimeMillis == 0) return 0;
        return (System.currentTimeMillis() - startTimeMillis) / 1000;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_STOP.equals(action) || "STOP".equals(action)) {
                stopVpn();
                return START_NOT_STICKY;
            } else if (ACTION_RESTART.equals(action)) {
                dnsCache.clear();
                updateNotification();
                return START_STICKY;
            }

            String preset = intent.getStringExtra("preset");
            if (preset != null && !preset.isEmpty()) {
                currentPreset = preset;
            }
        }

        if (startTimeMillis == 0) {
            startTimeMillis = System.currentTimeMillis();
        }

        startForegroundNotification();
        startVpn();
        return START_STICKY;
    }

    private void startForegroundNotification() {
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && manager != null) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "HikoDPI Canlı Koruma Durumu",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("DPI ve DNS tüneli açıkken anlık durumu ve oturum sayacını gösterir");
            channel.enableLights(true);
            channel.setShowBadge(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            manager.createNotificationChannel(channel);
        }

        Notification notification = buildActiveNotification();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                    NOTIFICATION_ID,
                    notification,
                    android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            );
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    private void updateNotification() {
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager != null && isRunning) {
            manager.notify(NOTIFICATION_ID, buildActiveNotification());
        }
    }

    private Notification buildActiveNotification() {
        // 1. Tıklayınca uygulamayı aç
        Intent openAppIntent = new Intent(this, MainActivity.class);
        openAppIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(
                this,
                0,
                openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        // 2. Bildirim içi aksiyon: "DPI Kapat"
        Intent stopIntent = new Intent(this, HikoDpiVpnService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPendingIntent = PendingIntent.getService(
                this,
                1,
                stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        // 3. Bildirim içi aksiyon: "Yenile"
        Intent restartIntent = new Intent(this, HikoDpiVpnService.class);
        restartIntent.setAction(ACTION_RESTART);
        PendingIntent restartPendingIntent = PendingIntent.getService(
                this,
                2,
                restartIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("🛡️ HikoDPI: KORUMA AKTİF")
                .setContentText("Profil: " + currentPreset + " • DoH 1.1.1.1 + SNI Split")
                .setSubText("Canlı Sayaç")
                // Android SystemUI tarafından asla reddedilmeyen uygulama ikonu:
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(openAppPendingIntent)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                // Donanımsal Canlı Sayaç
                .setUsesChronometer(true)
                .setWhen(startTimeMillis > 0 ? startTimeMillis : System.currentTimeMillis())
                .setShowWhen(true)
                // Kontrol Tuşları
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "DPI Kapat", stopPendingIntent)
                .addAction(android.R.drawable.ic_popup_sync, "Yenile", restartPendingIntent)
                .addAction(android.R.drawable.ic_menu_view, "Aç", openAppPendingIntent);

        return builder.build();
    }

    private synchronized void startVpn() {
        if (isRunning && vpnInterface != null) {
            return;
        }

        try {
            if (vpnInterface != null) {
                vpnInterface.close();
            }

            // 1. Yerel SNI Parçalama Proxy'sini Başlat (127.0.0.1:8899)
            if (proxyServer == null) {
                proxyServer = new HikoDpiProxyServer(this);
            }
            proxyServer.start();

            // 2. VPN Tünelini Oluştur
            Builder builder = new Builder();
            builder.setSession("HikoDPI Mobile")
                    .setMtu(1500)
                    .addAddress(VIRTUAL_CLIENT_IP, 32)
                    .addDnsServer(VIRTUAL_DNS_IP)
                    .addRoute(VIRTUAL_DNS_IP, 32);

            // Android 10+ (API 29+) cihazlarda HTTPS trafiğini yerel SNI Parçalayıcı Proxy'ye yönlendir
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                builder.setHttpProxy(ProxyInfo.buildDirectProxy("127.0.0.1", HikoDpiProxyServer.PROXY_PORT));
                builder.setMetered(false);
            }

            vpnInterface = builder.establish();
            isRunning = true;
            dnsExecutor = Executors.newFixedThreadPool(4);

            workerThread = new Thread(this, "HikoDpiVpnThread");
            workerThread.start();

            Log.i(TAG, "HikoDPI DoH TUN & SNI Proxy started successfully.");

        } catch (Exception e) {
            Log.e(TAG, "Failed to establish VPN interface: " + e.getMessage(), e);
            stopVpn();
        }
    }

    @Override
    public void run() {
        if (vpnInterface == null) return;

        FileInputStream in = new FileInputStream(vpnInterface.getFileDescriptor());
        FileOutputStream out = new FileOutputStream(vpnInterface.getFileDescriptor());
        byte[] packet = new byte[4096];

        while (isRunning && !Thread.currentThread().isInterrupted()) {
            try {
                int length = in.read(packet);
                if (length < 28) continue;

                int version = (packet[0] >> 4) & 0x0F;
                if (version != 4) continue;

                int ihl = (packet[0] & 0x0F) * 4;
                int protocol = packet[9] & 0xFF;
                if (protocol != 17) continue;

                int srcPort = ((packet[ihl] & 0xFF) << 8) | (packet[ihl + 1] & 0xFF);
                int dstPort = ((packet[ihl + 2] & 0xFF) << 8) | (packet[ihl + 3] & 0xFF);

                if (dstPort != 53) continue;

                int udpLen = ((packet[ihl + 4] & 0xFF) << 8) | (packet[ihl + 5] & 0xFF);
                int dnsLen = udpLen - 8;
                if (dnsLen <= 0 || (ihl + 8 + dnsLen) > length) continue;

                byte[] dnsQuery = new byte[dnsLen];
                System.arraycopy(packet, ihl + 8, dnsQuery, 0, dnsLen);

                byte[] clientIp = new byte[4];
                System.arraycopy(packet, 12, clientIp, 0, 4);

                byte[] serverIp = new byte[4];
                System.arraycopy(packet, 16, serverIp, 0, 4);

                final int clientPort = srcPort;

                if (dnsExecutor != null && !dnsExecutor.isShutdown()) {
                    dnsExecutor.submit(() -> {
                        try {
                            byte[] dnsResponse = resolveDoH(dnsQuery);
                            if (dnsResponse != null && dnsResponse.length > 0) {
                                byte[] replyPacket = buildDnsReplyPacket(serverIp, clientIp, 53, clientPort, dnsResponse);
                                synchronized (out) {
                                    out.write(replyPacket);
                                }
                            }
                        } catch (Exception e) {
                            Log.w(TAG, "DNS resolution write error: " + e.getMessage());
                        }
                    });
                }

            } catch (IOException e) {
                if (!isRunning) break;
                Log.w(TAG, "VPN read loop closed: " + e.getMessage());
                break;
            } catch (Exception e) {
                Log.e(TAG, "Unexpected error in VPN loop: " + e.getMessage(), e);
            }
        }
    }

    private byte[] resolveDoH(byte[] query) {
        String cacheKey = Arrays.toString(query);
        byte[] cached = dnsCache.get(cacheKey);
        if (cached != null) {
            return cached;
        }

        byte[] result = queryDoHEndpoint("https://1.1.1.1/dns-query", query);
        if (result == null) {
            result = queryDoHEndpoint("https://dns.google/dns-query", query);
        }

        if (result != null && result.length > 0) {
            if (dnsCache.size() > 500) {
                dnsCache.clear();
            }
            dnsCache.put(cacheKey, result);
        }

        return result;
    }

    private byte[] queryDoHEndpoint(String endpoint, byte[] query) {
        HttpsURLConnection conn = null;
        try {
            URL url = new URL(endpoint);
            conn = (HttpsURLConnection) url.openConnection();
            conn.setConnectTimeout(2500);
            conn.setReadTimeout(3000);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/dns-message");
            conn.setRequestProperty("Accept", "application/dns-message");
            conn.setRequestProperty("User-Agent", "HikoDPI-Mobile/0.2.0");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(query);
            os.flush();
            os.close();

            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                InputStream is = conn.getInputStream();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] buf = new byte[1024];
                int read;
                while ((read = is.read(buf)) != -1) {
                    baos.write(buf, 0, read);
                }
                return baos.toByteArray();
            }
        } catch (Exception e) {
            Log.d(TAG, "DoH query failed on " + endpoint + ": " + e.getMessage());
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        return null;
    }

    private byte[] buildDnsReplyPacket(byte[] srcIp, byte[] dstIp, int srcPort, int dstPort, byte[] dnsPayload) {
        int totalLen = 20 + 8 + dnsPayload.length;
        byte[] reply = new byte[totalLen];

        reply[0] = 0x45;
        reply[1] = 0x00;
        reply[2] = (byte) ((totalLen >> 8) & 0xFF);
        reply[3] = (byte) (totalLen & 0xFF);
        reply[4] = 0x00;
        reply[5] = 0x00;
        reply[6] = 0x40;
        reply[7] = 0x00;
        reply[8] = 0x40;
        reply[9] = 17;
        reply[10] = 0;
        reply[11] = 0;

        System.arraycopy(srcIp, 0, reply, 12, 4);
        System.arraycopy(dstIp, 0, reply, 16, 4);

        int ipChecksum = computeIpChecksum(reply, 0, 20);
        reply[10] = (byte) ((ipChecksum >> 8) & 0xFF);
        reply[11] = (byte) (ipChecksum & 0xFF);

        reply[20] = (byte) ((srcPort >> 8) & 0xFF);
        reply[21] = (byte) (srcPort & 0xFF);
        reply[22] = (byte) ((dstPort >> 8) & 0xFF);
        reply[23] = (byte) (dstPort & 0xFF);

        int udpLen = 8 + dnsPayload.length;
        reply[24] = (byte) ((udpLen >> 8) & 0xFF);
        reply[25] = (byte) (udpLen & 0xFF);
        reply[26] = 0;
        reply[27] = 0;

        System.arraycopy(dnsPayload, 0, reply, 28, dnsPayload.length);
        return reply;
    }

    private static int computeIpChecksum(byte[] buf, int offset, int length) {
        int sum = 0;
        for (int i = 0; i < length; i += 2) {
            int word = ((buf[offset + i] & 0xFF) << 8) | (buf[offset + i + 1] & 0xFF);
            sum += word;
        }
        while ((sum >> 16) > 0) {
            sum = (sum & 0xFFFF) + (sum >> 16);
        }
        return (~sum) & 0xFFFF;
    }

    private synchronized void stopVpn() {
        isRunning = false;
        startTimeMillis = 0;

        if (proxyServer != null) {
            proxyServer.stop();
            proxyServer = null;
        }

        if (workerThread != null) {
            workerThread.interrupt();
            workerThread = null;
        }

        if (dnsExecutor != null) {
            dnsExecutor.shutdownNow();
            dnsExecutor = null;
        }

        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException ignored) {}
            vpnInterface = null;
        }

        stopForeground(true);
        stopSelf();
        Log.i(TAG, "HikoDPI VPN & Proxy stopped cleanly.");
    }

    @Override
    public void onDestroy() {
        stopVpn();
        super.onDestroy();
    }
}
