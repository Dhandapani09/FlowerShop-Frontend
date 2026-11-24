const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("desktopInfo", {
  isDesktop: true,
  platform: process.platform,
  appName: "Flower Wholesale Management"
});
