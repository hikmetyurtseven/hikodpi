const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');
const { execSync } = require('child_process');

let mainWindow = null;
let proxyServer = null;
let isProxyActive = false;
let activePreset = 'discord';

const PROXY_CONFIG = {
  port: 8080,
  host: '127.0.0.1',
  dohServer: 'https://1.1.1.1/dns-query',
  dohFallback: 'https://dns.google/resolve',
  splitPosition: 2,
  splitDelayMs: 2,
};

const dnsCache = new Map();

/**
 * Yönetici yetkisi denetimi
 */
function checkIsAdmin() {
  try {
    execSync('net session', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Cloudflare / Google DoH sorgusu
 */
async function resolveDoH(domain) {
  if (net.isIP(domain)) return domain;
  if (dnsCache.has(domain)) return dnsCache.get(domain);

  try {
    const url = `${PROXY_CONFIG.dohServer}?name=${encodeURIComponent(domain)}&type=A`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/dns-json' },
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) {
        const aRecord = data.Answer.find(ans => ans.type === 1);
        if (aRecord && aRecord.data) {
          dnsCache.set(domain, aRecord.data);
          return aRecord.data;
        }
      }
    }
  } catch (e) {}

  try {
    const url = `${PROXY_CONFIG.dohFallback}?name=${encodeURIComponent(domain)}&type=A`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) {
        const aRecord = data.Answer.find(ans => ans.type === 1);
        if (aRecord && aRecord.data) {
          dnsCache.set(domain, aRecord.data);
          return aRecord.data;
        }
      }
    }
  } catch (e) {}

  return domain;
}

/**
 * Windows Sistem Proxy Aç/Kapat
 */
function setWindowsSystemProxy(enable) {
  const regKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';
  try {
    if (enable) {
      execSync(`reg add "${regKey}" /v ProxyEnable /t REG_DWORD /d 1 /f`, { stdio: 'ignore' });
      execSync(`reg add "${regKey}" /v ProxyServer /t REG_SZ /d "${PROXY_CONFIG.host}:${PROXY_CONFIG.port}" /f`, { stdio: 'ignore' });
    } else {
      execSync(`reg add "${regKey}" /v ProxyEnable /t REG_DWORD /d 0 /f`, { stdio: 'ignore' });
    }
  } catch (err) {}
}

/**
 * Proxy Sunucusunu Başlat
 */
function startProxyServer() {
  if (proxyServer) return;

  proxyServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: 'HikoDPI',
      status: 'active',
      port: PROXY_CONFIG.port,
      doh: PROXY_CONFIG.dohServer,
      builtWith: 'Vibecoding 🎧',
    }));
  });

  proxyServer.on('connect', async (req, clientSocket) => {
    const [rawHost, rawPort] = req.url.split(':');
    const targetPort = parseInt(rawPort, 10) || 443;
    const targetIp = await resolveDoH(rawHost);

    const serverSocket = net.connect(targetPort, targetIp, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

      let isFirstPacket = true;
      clientSocket.on('data', (chunk) => {
        if (isFirstPacket) {
          isFirstPacket = false;
          // TLS Handshake kontrolü (0x16 0x03)
          if (chunk.length > 5 && chunk[0] === 0x16 && chunk[1] === 0x03) {
            const splitPos = Math.min(PROXY_CONFIG.splitPosition, chunk.length - 1);
            const part1 = chunk.subarray(0, splitPos);
            const part2 = chunk.subarray(splitPos);

            serverSocket.setNoDelay(true);
            serverSocket.write(part1);

            setTimeout(() => {
              serverSocket.write(part2);
            }, PROXY_CONFIG.splitDelayMs);

            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('packet-event', {
                host: rawHost,
                split: splitPos,
                time: new Date().toLocaleTimeString('tr-TR')
              });
            }
            return;
          }
        }
        serverSocket.write(chunk);
      });

      serverSocket.pipe(clientSocket);
    });

    serverSocket.on('error', () => clientSocket.destroy());
    clientSocket.on('error', () => serverSocket.destroy());
  });

  proxyServer.listen(PROXY_CONFIG.port, PROXY_CONFIG.host);
}

/**
 * Proxy Sunucusunu Durdur
 */
function stopProxyServer() {
  if (proxyServer) {
    proxyServer.close();
    proxyServer = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 780,
    minWidth: 780,
    minHeight: 620,
    backgroundColor: '#0a0e17',
    show: false,
    autoHideMenuBar: true,
    title: 'HikoDPI Pro (Built with Vibecoding)',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  const distPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(distPath).catch(() => {
    mainWindow.loadURL('http://localhost:1420');
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    setWindowsSystemProxy(false);
  });
}

// IPC Handlers
ipcMain.handle('get-status', () => {
  return {
    isActive: isProxyActive,
    isAdmin: checkIsAdmin(),
    preset: activePreset,
    port: PROXY_CONFIG.port,
    doh: PROXY_CONFIG.dohServer,
  };
});

ipcMain.handle('toggle-proxy', (event, { enable, preset, splitPosition }) => {
  if (preset) activePreset = preset;
  if (splitPosition) PROXY_CONFIG.splitPosition = parseInt(splitPosition, 10) || 2;

  if (enable) {
    startProxyServer();
    setWindowsSystemProxy(true);
    isProxyActive = true;
  } else {
    stopProxyServer();
    setWindowsSystemProxy(false);
    isProxyActive = false;
  }

  return { success: true, isActive: isProxyActive, isAdmin: checkIsAdmin() };
});

ipcMain.handle('flush-dns', async () => {
  try {
    execSync('ipconfig /flushdns', { stdio: 'ignore' });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('quick-dns-fix', async () => {
  try {
    const cmd = `powershell -Command "Set-DnsClientServerAddress -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq 'Up').Name -ServerAddresses ('1.1.1.1','1.0.0.1'); Clear-DnsClientCache"`;
    execSync(cmd, { stdio: 'ignore' });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  setWindowsSystemProxy(false);
  stopProxyServer();
});

app.on('window-all-closed', () => {
  setWindowsSystemProxy(false);
  stopProxyServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
