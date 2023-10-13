import { ipcMain } from "electron"
import { getServices, findServiceName, findServiceHandler } from "./services"
import { getNotifys, findNotifyName, findNotifyHandler } from './notify'
import ErrorNotify from "./notify/Error"
import { Bridge, Preload } from '@common/@types'
import { ErrorCode, EError } from '@common/Error'
import log from 'electron-log'

let enbaleBridge = false
const ioc = new Map<string, any>()
const ERR_MESSAGE_BOX = new Map<ErrorCode, number>()
const listeners = new Map<string, Preload.ServicePair>()


const printError = (err: Error | EError) => {
    if (err instanceof EError) {
        if (ERR_MESSAGE_BOX.get(err.code)) {
            return
        } else {
            ERR_MESSAGE_BOX.set(err.code, 1)
            log.error(err.message)
            setTimeout(() => {
                ERR_MESSAGE_BOX.delete(err.code)
            }, err.interval)
        }
    } else if (err instanceof Error) {
        log.error(err.message)
    }
}

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
        const serviceName = findServiceName(service)
        const handlers = findServiceHandler(service)
        let instance = ioc.get(serviceName)
        if (!instance) {
            instance = new service()
            ioc.set(serviceName, instance)
        }
        handlers.forEach(handler => {
            const { name: handleName } = handler
            const channel = `${serviceName}.${handleName}`
            log.info(`Register Service Channel: ${channel}`)
            if (instance[handleName]) {
                listeners.set(channel, Object.assign(handler, {
                    fn: instance[handleName]
                }))
            } else {
                // 静态方法
                listeners.set(channel, Object.assign(handler, {
                    fn: instance.__proto__.constructor[handleName]
                }))
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
                handelers: handlers.map(handler => handler.name)
            })
        })
        return config
    })
    ipcMain.handle(`build-preload-notify`, async () => {
        return notifyMap
    })
    ipcMain.handle(`service`, async (_, channel, ...args) => {
        const handler = listeners.get(channel)

        if (!handler) {
            return
        }
        const { requireEvent, fn } = handler
        try {
            let rev: any = undefined
            if (requireEvent) {
                rev = [null, await fn(event, ...args)]
            } else {
                rev = [null, await fn(...args)]
            }
            return rev
        } catch (error) {
            let errInfo = `Service Error: ${channel}`
            if (error instanceof Error) {
                errInfo = `${errInfo}, ${error.message}`
                printError(error)
            } else {
                log.error(error)
            }
            ErrorNotify.log(error)
            return [errInfo]
        }
    })
}

