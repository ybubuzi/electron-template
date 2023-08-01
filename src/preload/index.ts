import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type IBridgeConfig = {
  serviceName: string
  handelers: string[]
}



const initPreloadBridge = async () => {
  const service = {}
  const config: IBridgeConfig[] = await electronAPI.ipcRenderer.invoke(`build-preload-bridge`)
  config.forEach(({ serviceName, handelers }) => {
    service[serviceName] = {}
    handelers.forEach(handler => {
      const channel = `${serviceName}.${handler}`
      service[serviceName][handler] = (...args: any) => {
        return electronAPI.ipcRenderer.invoke("service", channel, ...args)
      }
    })
  })
  return service
}


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
  }
}
if (process.contextIsolated) {
  try {

    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    initPreloadBridge().then((service) => {
      contextBridge.exposeInMainWorld('service', service)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
