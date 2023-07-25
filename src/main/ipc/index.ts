/**
 * @Name: ipc/index.ts
 * @Author: bubuzi
 * @Date: 2023/07/25 18:32
 * @Version: 1.0.0
 * @Description: 用于注册主进程中所有的ipc事件
 */
import { ipcMain } from 'electron'
import { SyncIpcListener, AsyncIpcListener, IpcListener } from './IpcBase'
/**
 * 初始化全局所有的ipc事件
 * @returns {void}
 */
export const installIpc = () => {

    const asyncListeners: Map<string, AsyncIpcListener> = new Map()
    const syncListeners: Map<string, SyncIpcListener> = new Map()

    // @ts-ignore
    const ipcFiles = import.meta.globEager('./**/index.ts')
    Object.keys(ipcFiles).forEach(path => {
        const modelIpc = ipcFiles[path].default || ipcFiles[path]
        if (modelIpc) {
            const ipcs = modelIpc?.getListeners?.() as IpcListener[]
            ipcs.forEach(ipc => {
                switch (ipc.mode) {
                    case 'sync':
                        syncListeners.set(ipc.name, ipc as SyncIpcListener)
                        break
                    case 'async':
                        asyncListeners.set(ipc.name, ipc as AsyncIpcListener)
                        break
                }
            })
        }
    })

    // 异步调用
    ipcMain.on(`main-async`, (_, eventName, ...args) => {
        console.log(`main-async: ${eventName}`)
        return asyncListeners.get(eventName)?.callback(_, ...args)
    });
    // 同步调用
    ipcMain.handle(`main-sync`, (_, eventName, ...args) => {
        console.log(`main-sync: ${eventName}`)
        return syncListeners.get(eventName)?.callback(_, ...args)
    })
}