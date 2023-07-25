
type IpcCallback<T extends Electron.IpcMainEvent | Electron.IpcMainInvokeEvent> = (event: T, ...args: any[]) => any;
export type SyncIpcCallback = IpcCallback<Electron.IpcMainInvokeEvent>;
export type AsyncIpcCallback = IpcCallback<Electron.IpcMainEvent>;

export interface SyncIpcListener {
    mode: 'sync'
    callback: SyncIpcCallback;
}
export interface AsyncIpcListener {
    mode: 'async'
    callback: AsyncIpcCallback;
}

export type IpcListener = {
    name: string;
    mode: 'sync' | 'async';
} & (SyncIpcListener | AsyncIpcListener) 