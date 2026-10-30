const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('focuscat',{
  minimize:()=>ipcRenderer.invoke('focuscat:minimize'),
  close:()=>ipcRenderer.invoke('focuscat:close'),
  setAlwaysOnTop:value=>ipcRenderer.invoke('focuscat:always-on-top',value)
});
