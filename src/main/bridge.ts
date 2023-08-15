import { ipcMain } from "electron"
import { getServices, findServiceName, findServiceHandler } from "./services"
import { getNotifys, findNotifyName, findNotifyHandler } from './notify'
import { Bridge } from '@common/@types'

let enbaleBridge = false
const ioc = new Map<string, any>()


const listeners = new Map<string, Function>()
export const initBridge = () => {
    if (enbaleBridge) return
    enbaleBridge = true
    const notifyMap = {}
    const notifys = getNotifys()
    notifys.forEach(notify => {
        const name = findNotifyName(notify)
        const handlers = findNotifyHandler(notify)
        notifyMap[name] = handlers
    })


    const services = getServices()
    services.forEach(service => {
        const name = findServiceName(service)
        const handlers = findServiceHandler(service)
        let instance = ioc.get(name)
        if (!instance) {
            instance = new service()
            ioc.set(name, instance)
        }
        handlers.forEach(handler => {
            const channel = `${name}.${handler}`
            console.log(`register service channel: ${channel}`)
            if (instance[handler]) {
                listeners.set(channel, instance[handler])
            } else {
                // 静态方法
                listeners.set(channel, instance.__proto__.constructor[handler])
            }
        })
    })
    ipcMain.handle(`build-preload-bridge`, async () => {
        const config: Bridge.Service[] = []
        services.forEach(service => {
            const name = findServiceName(service)
            const handlers = findServiceHandler(service)
            config.push({
                serviceName: name,
                handelers: handlers
            })
        })
        return config
    })
    ipcMain.handle(`build-preload-notify`, async () => {
        return notifyMap
    })
    ipcMain.handle(`service`, async (_, channel, ...args) => {
        const method = listeners.get(channel)
        if (!method) {
            return
        }
        return await method(...args)
    })
}

