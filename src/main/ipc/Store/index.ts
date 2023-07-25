/**
 * @Name: Store/ipc
 * @Author: bubuzi
 * @Date: 2023/07/25 18:13
 * @Version: 1.0.0
 * @Description: 处理持久化相关的ipc事件
 */
import { StoreEvents } from '@common/IpcEvent'
import { SyncIpcCallback, IpcListener } from '../IpcBase'

const getStoreValue: SyncIpcCallback = (_, key) => {
    console.log(`callback === `, key)
}

export const getListeners = (): IpcListener[] => {
    const listeners: IpcListener[] = []

    listeners.push({
        name: StoreEvents.STORE_GET,
        mode: 'sync',
        callback: getStoreValue
    })
    return listeners
}