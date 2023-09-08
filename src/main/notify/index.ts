/**
 * @Name: Notify/index.ts
 * @Author: bubuzi
 * @Date: 2023/08/15 11:53
 * @Version: 1.0.0
 * @Description: 用于通知主进程的装饰器
 */
import { BrowserWindow } from 'electron'
import { Preload } from '@common/@types'
import log from 'electron-log'
/**
 * 类装饰器，用于注册通知名称
 * @param notifyName 通知通道名
 * @returns 
 */
export function NotifyRegister(notifyName?: string): Function {
    return function (target: unknown) {
        // @ts-ignore
        target.prototype.notifyName! = notifyName || target.name;

        // @ts-ignore
        target.notifyName = notifyName || target.name;
    }
}


/**
 * 方法装饰器，用于通知渲染进程具体的通知
 * @param {Preload.NotifyField} field 通知字段
 * @param {string} field.name 通知名称
 * @param {string} field.type 通知类型
 * @param {boolean} field.is_return 是否返回值 
 * @returns 
 */
export function NotifyHandler(field: Preload.NotifyField = {
    name: undefined,
    type: 'info',
    is_return: false
}): Function {
    const { name, type, is_return } = field
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const notifyName = name ?? propertyKey
        if (!target.prototype.notify) {
            target.prototype.notify = {}
        }
        const oldFn = descriptor.value
        const mdName = name || propertyKey
        // @ts-ignore
        descriptor.value = function (...args: any[]) {
            // @ts-ignore
            const notifyName: string = this.notifyName

            let sendData = args
            if (is_return) {
                sendData = oldFn.apply(this, args);
            }
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('notify', `${notifyName}.${mdName}`, {
                    type,
                    message: sendData
                })
            })
            return void 0
        }
        target.prototype.notify[notifyName] = descriptor.value
    }
}

/**
 * 获取所有的通知服务名
 * @returns {Array<Function>}
 */
export const getNotifys = () => {
    // @ts-ignore
    const modules = import.meta.globEager('./**/index.ts')
    const notifys: any[] = []
    Object.keys(modules).forEach(path => {
        const clazz = modules[path].default || modules[path]
        notifys.push(clazz)
    })
    return notifys
}

/**
 * 获取对应通知的服务名称
 * @param {Object} target  通知服务原型对象
 * @returns {String} 服务名称
 */
export const findNotifyName = (target: unknown): string => {
    // @ts-ignore
    return target['notifyName']
}
/**
 * 获取对应通知的所有通知方法
 * @param {Object} target  通知服务原型对象
 * @returns {Array<String>} 通知方法名集合
 */
export const findNotifyHandler = (target: unknown): string[] => {

    const NotifyHandler: string[] = []
    if (typeof target !== 'function') {
        return NotifyHandler
    }
    const notifyName = findNotifyName(target)
    const notifyObj = target.prototype.notify
    for (const name of Object.keys(notifyObj)) {
        NotifyHandler.push(name)
        log.info(`Register Notify Channel: ${notifyName}.${name}`)
    }
    return NotifyHandler
}