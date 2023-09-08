
export namespace Core {
    type ArrayMax<T, X extends number, A extends T[] = []> =
        A | ([T, ...A]['length'] extends X ? never : ArrayMax<T, X, [T, ...A]>);

    export type ArrayRanged<T, N extends number, X extends number> = Exclude<ArrayMax<T, X>, ArrayMax<T, N>>;



    // 定义排除类型：将U从T中剔除, keyof 会取出T与U的所有键, 限定P的取值范围为T中的所有键, 并将其类型设为never
    export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

    // 定义互斥类型，T或U只有一个能出现（互相剔除时，被剔除方必须存在）
    export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

}

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
    type sendAPI = (channel: string, ...data: any) => void
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

    // =========================================================
    // =================== 内部注册类型 =========================
    // =========================================================
    export interface Notify {
        error: ErrorNotify
        window: WindowNotify
        download: DownloadNotify
    }
    export interface NotifyField {
        name?: string | undefined,  // 通知名称,window.notify.[NotifyRegister.name].[NotifyHandler.name]
        type?: 'success' | 'error' | 'warning' | 'info' | 'data',// 通知类型
        is_return?: boolean // 是否使用函数执行后的返回值通知渲染进程，否则将使用函数的参数通知渲染进程
    }
    export interface ServiceHandler {
        name: string
        requireEvent: boolean
    }
    export interface ServicePair extends ServiceHandler {
        fn: Function
    }
    export interface ServiceField {
        requireEvent?: boolean
    }



    // =========================================================
    // =================== 内部程序通知 =========================
    // =========================================================
    type NorifyCallbackHandle = (event: NotifyEvent) => unknown
    type NotifyHandler = (cb: NorifyCallbackHandle) => void
    export interface ErrorNotify {
        log: NotifyHandler
    }
    export interface WindowNotify {
        ready: NotifyHandler
        maximize: NotifyHandler
        unmaximize: NotifyHandler
        minimize: NotifyHandler
        deviceChanged: NotifyHandler

    }
    export interface DownloadNotify {
        progress: NotifyHandler
    }
    export interface NotifyEvent {
        type?: 'success' | 'error' | 'warning' | 'info' | 'data',
        message: unknown        // 具体参数类型需要使用者在使用时自行判断
    }

    // =========================================================
    // =================== 内部程序服务 =========================
    // =========================================================
    export interface Service {
        store: StoreService
        window: WindowService
    }
    export interface StoreService {
        getValue<T>(key: string): Promise<T>;
        setValue<T>(key: string, value: T): Promise<void>;
    }
    export interface WindowService {
        refresh(windowId?: number): Promise<void>;
        close(windowId?: number): Promise<void>;
        maximize(windowId?: number): Promise<void>;
        unmaximize(windowId?: number): Promise<void>;
        minimize(windowId?: number): Promise<void>;
    }

}


export namespace Connect {

    export interface RS485Option {
        host: string
        port: number

    }
    export interface SerialOption {
        path: string
        baudRate: number
        dataBits?: 5 | 6 | 7 | 8;
        stopBits?: 1 | 1.5 | 2;
        autoOpen?: boolean
    }
}


