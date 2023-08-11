import { BrowserWindow } from 'electron'
export function NotifyRegister(notifyName?: string): Function {
    return function (target: unknown) {
        const proto = Object.getPrototypeOf(target)
        // @ts-ignore
        target.prototype.notifyName! = notifyName || target.name;
        // @ts-ignore
        proto.notifyName! = notifyName || target.name;
    }
}

type NotifyField = {
    name?: string | undefined,                                  // 通知名称,window.notify.[NotifyRegister.name].[NotifyHandler.name]
    type?: 'success' | 'error' | 'warning' | 'info' | 'data',   // 通知类型
    is_return?: boolean                                         // 是否使用函数执行后的返回值通知渲染进程，否则将使用函数的参数通知渲染进程
}

export function NotifyHandler(field: NotifyField = {
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