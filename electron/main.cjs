const {app,BrowserWindow,ipcMain}=require('electron');
const path=require('path');
let mainWindow;
function createWindow(){
  mainWindow=new BrowserWindow({
    title:'FocusCat 墨团专注屋',width:1280,height:840,minWidth:980,minHeight:700,
    backgroundColor:'#101015',autoHideMenuBar:true,show:false,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}
  });
  mainWindow.loadFile(path.join(__dirname,'..','index.html'));
  mainWindow.once('ready-to-show',()=>mainWindow.show());
}
ipcMain.handle('focuscat:minimize',()=>{mainWindow?.minimize();return true});
ipcMain.handle('focuscat:close',()=>{mainWindow?.close();return true});
ipcMain.handle('focuscat:always-on-top',(_e,value)=>{mainWindow?.setAlwaysOnTop(Boolean(value));return true});
const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();else{
  app.on('second-instance',()=>{if(mainWindow){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.focus()}});
  app.whenReady().then(()=>{app.setAppUserModelId('com.meowbuild.focuscat');createWindow();app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()})});
  app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
}
