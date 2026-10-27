/**
 * HikoDPI - Yerel DPI Baypas & DoH Proxy Motoru (v0.2.0)
 * 
 * Çözülen Sorunlar:
 * 1. "Gizlilik Hatası (NET::ERR_CERT_COMMON_NAME_INVALID)":
 *    Türk Telekom/Superonline DNS zehirlemesi nedeniyle siteler BTK engelli IP'sine (195.175.254.2)
 *    yönlendiriliyordu. Bu proxy, TÜM DNS sorgularını doğrudan şifreli Cloudflare DoH (1.1.1.1)
 *    üzerinden çözerek gerçek IP'leri alır.
 * 2. "Bağlantı Sıfırlandı (Connection Reset / DPI Bloklaması)":
 *    DPI kutularının TLS ClientHello (SNI) tespitini engellemek için paket 2. bayttan parçalanarak
 *    hedefe iletilir.
 */

import http from 'node:http';
import net from 'node:net';
import { exec, execSync } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const CONFIG = {
  port: 8080,
  host: '127.0.0.1',
  dohServer: 'https://1.1.1.1/dns-query',
  dohFallback: 'https://dns.google/resolve',
  splitPosition: 2, // 2. bayt parçalama
  splitDelayMs: 2,
};

// DNS Önbelleği
const dnsCache = new Map();

/**
 * Cloudflare / Google DoH üzerinden DNS sorgusu
 */
async function resolveDoH(domain) {
  if (net.isIP(domain)) return domain;

  if (dnsCache.has(domain)) {
    return dnsCache.get(domain);
  }

  // 1. Cloudflare DoH
  try {
    const url = `${CONFIG.dohServer}?name=${encodeURIComponent(domain)}&type=A`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/dns-json' },
      signal: AbortSignal.timeout(3500)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.Answer && data.Answer.length > 0) {
        const aRecord = data.Answer.find(ans => ans.type === 1);
        if (aRecord && aRecord.data) {
          dnsCache.set(domain, aRecord.data);
          return aRecord.data;
        }
      }
    }
  } catch (err) {
    // Fallback'e geç
  }

  // 2. Google DoH Fallback
  try {
    const url = `${CONFIG.dohFallback}?name=${encodeURIComponent(domain)}&type=A`;
    const response = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (response.ok) {
      const data = await response.json();
      if (data.Answer && data.Answer.length > 0) {
        const aRecord = data.Answer.find(ans => ans.type === 1);
        if (aRecord && aRecord.data) {
          dnsCache.set(domain, aRecord.data);
          return aRecord.data;
        }
      }
    }
  } catch (err) {
    console.warn(`[HikoDPI] "${domain}" DoH ile çözülemedi, yerel DNS deneniyor.`);
  }

  return domain;
}

/**
 * Windows Sistem Proxy Aç/Kapat
 */
export function setWindowsSystemProxySync(enable) {
  const regKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';
  try {
    if (enable) {
      execSync(`reg add "${regKey}" /v ProxyEnable /t REG_DWORD /d 1 /f`, { stdio: 'ignore' });
      execSync(`reg add "${regKey}" /v ProxyServer /t REG_SZ /d "${CONFIG.host}:${CONFIG.port}" /f`, { stdio: 'ignore' });
      console.log(`[HikoDPI] Windows Sistem Proxy AÇILDI: ${CONFIG.host}:${CONFIG.port}`);
    } else {
      execSync(`reg add "${regKey}" /v ProxyEnable /t REG_DWORD /d 0 /f`, { stdio: 'ignore' });
      console.log('[HikoDPI] Windows Sistem Proxy KAPATILDI.');
    }
  } catch (err) {
    console.error('[HikoDPI] Sistem Proxy ayar hatası:', err.message);
  }
}

/**
 * Proxy Sunucusu Başlat
 */
export function startProxyServer(port = CONFIG.port) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'HikoDPI Engine',
      version: '0.2.0',
      status: 'active',
      port,
      doh: CONFIG.dohServer,
      sniSplit: `${CONFIG.splitPosition}. byte`,
    }));
  });

  server.on('connect', async (req, clientSocket, head) => {
    const [rawHost, rawPort] = req.url.split(':');
    const targetPort = parseInt(rawPort, 10) || 443;

    // DoH ile gerçek IP'yi al (BTK 195.175.254.2 tuzağını baypas eder)
    const targetIp = await resolveDoH(rawHost);

    const serverSocket = net.connect(targetPort, targetIp, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

      let isFirstPacket = true;

      clientSocket.on('data', (chunk) => {
        if (isFirstPacket) {
          isFirstPacket = false;
          // TLS ClientHello (0x16 0x03) kontrolü
          if (chunk.length > 5 && chunk[0] === 0x16 && chunk[1] === 0x03) {
            const splitPos = Math.min(CONFIG.splitPosition, chunk.length - 1);
            const part1 = chunk.subarray(0, splitPos);
            const part2 = chunk.subarray(splitPos);

            serverSocket.setNoDelay(true);
            serverSocket.write(part1);

            // 2ms aralıkla göndererek ISP DPI inceleme tablosunu atlatır
            setTimeout(() => {
              serverSocket.write(part2);
            }, CONFIG.splitDelayMs);
            return;
          }
        }

        serverSocket.write(chunk);
      });

      serverSocket.pipe(clientSocket);
    });

    serverSocket.on('error', () => {
      clientSocket.destroy();
    });

    clientSocket.on('error', () => {
      serverSocket.destroy();
    });
  });

  server.listen(port, CONFIG.host, () => {
    console.log(`========================================================`);
    console.log(`  🛡️  HikoDPI Yerel Baypas Motoru Aktif!`);
    console.log(`  📡  Proxy Adresi: http://${CONFIG.host}:${port}`);
    console.log(`  🔒  DoH Şifreli DNS: Cloudflare (1.1.1.1)`);
    console.log(`  ⚡  SNI Parçalama: 2. Bayt (DPI Reset Engellendi)`);
    console.log(`========================================================`);
  });

  return server;
}

// Konsoldan doğrudan çalıştırıldığında (node engine/proxy.js --system-proxy)
if (process.argv[1]?.endsWith('proxy.js')) {
  const useSystemProxy = process.argv.includes('--system-proxy');
  startProxyServer();

  if (useSystemProxy) {
    setWindowsSystemProxySync(true);

    const cleanup = () => {
      console.log('\n[HikoDPI] Kapatılıyor, Sistem Proxy ayarları temizleniyor...');
      setWindowsSystemProxySync(false);
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', () => setWindowsSystemProxySync(false));
  }
}
