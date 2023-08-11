import { BrowserWindow } from 'electron'
import { Preload } from '@common/@types'
export function NotifyRegister(notifyName?: string): Function {
    return function (target: unknown) {
        // @ts-ignore
        target.prototype.notifyName! = notifyName || target.name;

        // @ts-ignore
        target.notifyName = notifyName || target.name;
    }
}


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


export const findNotifyName = (target: unknown): string => {
    // @ts-ignore
    return target['notifyName']
}

export const findNotifyHandler = (target: unknown): string[] => {

    const NotifyHandler: string[] = []
    if (typeof target !== 'function') {
        return NotifyHandler
    }
    const notifyName = findNotifyName(target)
    const notifyObj = target.prototype.notify
    for (const name of Object.keys(notifyObj)) {
        NotifyHandler.push(name)
        console.log(`register notify channel: ${notifyName}.${name}`)
    }
    return NotifyHandler
}