import { ipcMain } from "electron"
import { getServices, findServiceName, findServiceHandler } from "./services"
import { IBridgeConfig } from '../preload'

let enbaleBridge = false
const ioc = new Map<string, any>()


const listeners = new Map<string, Function>()
export const initBridge = () => {
    if (enbaleBridge) return
    enbaleBridge = true
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
            console.log(`channel: ${channel}`)
            listeners.set(channel, instance[handler])
        })
    })
    ipcMain.handle(`build-preload-bridge`, async () => {
        const config: IBridgeConfig[] = []
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
    ipcMain.handle(`service`, async (event, channel, ...args) => {
        const method = listeners.get(channel)
        if (!method) {
            return
        }
        return await method(...args)
    })
}

