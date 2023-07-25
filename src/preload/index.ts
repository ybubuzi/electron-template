import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'




// Custom APIs for renderer
const api = {
  send: (channel: string, ...data: any) => {
    electronAPI.ipcRenderer.send(`main-async`, channel, ...data)
  },
  sendSync: <T>(channel: string, ...data: any): T => {
    return electronAPI.ipcRenderer.sendSync(`main-async`, channel, ...data)
  },
  invoke: <T>(channel: string, ...data: any): Promise<T> => {
    return electronAPI.ipcRenderer.invoke(`main-sync`, channel, ...data)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
