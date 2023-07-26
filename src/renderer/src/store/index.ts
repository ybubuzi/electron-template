/**
 * @Name: store\index.ts
 * @Author: bubuzi
 * @Date: 2023/07/26 09:13
 * @Version: 1.0.0
 * @Description: 用于管理和创建本地store，建立渲染进程和主进程的数据交换
 */
import { createPinia } from 'pinia'
import { StoreEvents } from '@common/IpcEvent'

import type { Store } from 'pinia'

/**
 * 加载保存的所有配置
 * @param id 
 * @param store 
 */
const loadStore = (id: string, store: Store) => {
    const storeId = id
    window.api.invoke(StoreEvents.STORE_GET, storeId).then(data => {
        const localData = data ?? {}
        const webData = store.$state
        const webKeys = Object.keys(webData)
        const localKeys = Object.keys(localData)
        if (data === undefined || localKeys.length != webKeys.length) {
            window.api.invoke(StoreEvents.STORE_SET, storeId, JSON.parse(JSON.stringify(webData)))
        } else {
            Object.keys(data).forEach(key => {
                store[key] = data[key]
            })
        }
        // const oldRset = store.$reset
        store.$reset = () => {
            // oldRset.call(store)
            window.api.invoke(StoreEvents.STORE_GET, storeId).then(data => {
                Object.keys(data).forEach(key => {
                    store[key] = data[key]
                })
            })
        }
        store.$subscribe((_, state) => {
            window.api.invoke(StoreEvents.STORE_SET, storeId, JSON.parse(JSON.stringify(state)))
        }, { deep: true })
    })
}

export const initIpcStore = () => {
    const storeFiles = import.meta.globEager('./local/*.ts')
    Object.keys(storeFiles).forEach(path => {
        // @ts-ignore
        const storeId = storeFiles[path].id
        // @ts-ignore
        const useStoreName = Object.keys(storeFiles[path]).find(key => key.startsWith('use') && key.endsWith('Store'))
        // @ts-ignore
        const useStore = storeFiles[path][useStoreName]
        if (!useStore) {
            return
        }
        const store = useStore() as Store
        loadStore(storeId, store)
    })
}


const pinia = createPinia()
export default pinia