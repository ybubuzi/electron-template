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