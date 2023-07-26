/**
 * @Name: Store/ipc
 * @Author: bubuzi
 * @Date: 2023/07/25 18:13
 * @Version: 1.0.0
 * @Description: 处理持久化相关的ipc事件
 */
import { StoreEvents } from '@common/IpcEvent'
import { SyncIpcCallback, IpcListener } from '../IpcBase'
import { getStoreValue, setStoreValue } from '@main/utils/StoreUtils'

const getValue: SyncIpcCallback = (_, key) => {
    return getStoreValue(key)
}
const setValue: SyncIpcCallback = (_, key, value) => {
    return setStoreValue(key, value)
}
export const getListeners = (): IpcListener[] => {
    const listeners: IpcListener[] = []

    listeners.push({
        name: StoreEvents.STORE_GET,
        mode: 'sync',
        callback: getValue
    })

    listeners.push({
        name: StoreEvents.STORE_SET,
        mode: 'sync',
        callback: setValue
    })
    return listeners
}