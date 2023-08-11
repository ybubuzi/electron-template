export namespace Bridge {
    export interface Service {
        serviceName: string
        handelers: string[]
    }
    export interface Notify {
        notifyName: string
        handelers: string[]
    }
}


export namespace Preload {
    type sendAPI = (channel: String, ...data: any) => void
    type sendSyncApi = <T>(channel: string, ...data: any) => T
    type invokeApi = (channel: string, ...data: any) => Promise<any>
    type onApi = (channel: string, listener: (...args: any[]) => void) => void
    export interface WindowApi {
        send: sendAPI,
        sendSync: sendSyncApi,
        invoke: invokeApi,
        on: onApi,
        once: onApi,
        off: (channel: string, listener?: (...args: any[]) => void) => void,
    }
    export interface Notify {
        error: ErrorNotify
    }
    export interface NotifyField {
        name?: string | undefined,  // 通知名称,window.notify.[NotifyRegister.name].[NotifyHandler.name]
        type?: 'success' | 'error' | 'warning' | 'info' | 'data',// 通知类型
        is_return?: boolean // 是否使用函数执行后的返回值通知渲染进程，否则将使用函数的参数通知渲染进程
    }
    export interface ErrorNotify {
        log(cb: (event: NotifyEvent) => unknown): void
    }
    export interface NotifyEvent {
        type?: 'success' | 'error' | 'warning' | 'info' | 'data',
        message: any
    }
    export interface Service {
        random: RandomService
        store: StoreService
    }
    export interface RandomService {
        randomNum(): Promise<number>
    }
    export interface StoreService {
        getValue<T>(key: string): Promise<T>;
        setValue<T>(key: string, value: T): Promise<void>;
    }
}