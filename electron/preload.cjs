const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hikodpi', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  toggleProxy: (options) => ipcRenderer.invoke('toggle-proxy', options),
  flushDns: () => ipcRenderer.invoke('flush-dns'),
  quickDnsFix: () => ipcRenderer.invoke('quick-dns-fix'),
  onPacketEvent: (callback) => {
    ipcRenderer.on('packet-event', (event, data) => callback(data));
  },
});
