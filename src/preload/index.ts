/**
 * @Name: Preload/index
 * @Author: bubuzi
 * @Date: 2023/08/15 11:49
 * @Version: 1.0.0
 * @Description: 用于渲染进程的预加载脚本，连接渲染进程和主进程
 */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Bridge } from '@common/@types'


// 用于存储notify的回调函数
const notifyCbMap = new Map<string, Function>()

/** 
 * 用于初始换preload的bridge，完成ipc注册，挂载至window对象以便直接调用
 */
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

/**
 * 用于初始化preload的notify，完成ipc注册，挂载至window对象
 * 使用前注册回调函数，当接收到主进程通知时将自动回调
 */
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
  electronAPI.ipcRenderer.on(`notify`, (_, channel, ...args) => {
    const cb = notifyCbMap.get(channel)
    if (cb) {
      cb(...args)
    }
  })
  return notify
}

/**
 * 遗留的开放ipc调用通道，后续删除
 */
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
    // 挂载对象至window对象
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
