import { BrowserWindow } from 'electron'

export function NotifyRegister(notifyName?: string): Function {
    return function (target: unknown) {
        // @ts-ignore
        target.prototype.notifyName! = notifyName || target.name;
    }
}

type NotifyField = {
    type: 'success' | 'error' | 'warning' | 'info'
}

const NotifyHandler: Function = ({ type }: NotifyField = {
    type: 'info'
}) => {
    console.log('NotifyHandler', type)
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // const oldFn = descriptor.value
        descriptor.value = function (...args: any[]) {
            // @ts-ignore
            const notifyName: string = this.notifyName
            // const res = oldFn.apply(this, args);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('notify', `${notifyName}.${propertyKey}`, {
                    type,
                    message: args
                })
            })
            // return res;
            return void 0
        }
    }
}


@NotifyRegister()
class Aoo {
    @NotifyHandler()
    seed(seed: string) {

    }
}
const o = new Aoo()
setInterval(() => {
    o.seed(`你好`)
}, 1000)