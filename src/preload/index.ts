import { contextBridge, ipcMain } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Bridge } from '@common/@types'



const notifyCbMap = new Map<string, Function>()
const initPreloadBridge = async () => {
  const service = {}
  const config: Bridge.Service[] = await electronAPI.ipcRenderer.invoke(`build-preload-bridge`)
  config.forEach(({ serviceName, handelers }) => {
    service[serviceName] = {}
    handelers.forEach(handler => {
      const channel = `${serviceName}.${handler}`
      service[serviceName][handler] = (...args: any) => {
        return new Promise(async (resolve, reject) => {
          try {
            const rev = await electronAPI.ipcRenderer.invoke("service", channel, ...args)
            resolve(rev)
          } catch (error) {
            if (error instanceof Error) {
              const m = error.message.match(/:\s?/)
              if (m && m.index && m.index > -1) {
                error.message = error.message.substring(m.index + m[0].length)
              }
              reject(error)
            }
          }
        })
      }
    })
  })
  return service
}

const initPreloadNotify = async () => {
  const notify = {}
  const notifyMap = await electronAPI.ipcRenderer.invoke(`build-preload-notify`)
  Object.keys(notifyMap).forEach((key) => {
    const handlers = notifyMap[key]
    handlers.forEach((handler) => {
      const channel = `${key}.${handler}`
      if (!notify[key]) {
        notify[key] = {}
      }
      notify[key][handler] = (cb: (...args) => any) => {
        notifyCbMap.set(channel, cb)
      }
    })
  })
  electronAPI.ipcRenderer.on(`notify`, (event, channel, ...args) => {
    const cb = notifyCbMap.get(channel)
    if (cb) {
      cb(...args)
    }
  })
  return notify
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
// const notify = 
if (process.contextIsolated) {
  try {

    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    initPreloadBridge().then((service) => {
      contextBridge.exposeInMainWorld('service', service)
    })
    initPreloadNotify().then((notify) => {
      contextBridge.exposeInMainWorld('notify', notify)
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
