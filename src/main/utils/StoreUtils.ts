/**
 * @Name: StoreUtils.ts
 * @Author: bubuzi
 * @Date: 2023/07/25 17:31
 * @Version: 1.0.0

* @Description: 管理electron-store，持久化存储数据
 */
import { is } from '@electron-toolkit/utils'
import Store from 'electron-store';
const PREFIX = 'store:'

const STORE = new Store()

const prepareKey = (key: string) => {
    if (!key) {
        throw new Error('key is empty')
    }
    if (key.includes(":")) {
        return key
    }
    return `${PREFIX}${key}`
}
export const getStoreValue = <T>(key: string): Partial<T> | null => {
    return STORE.get(prepareKey(key), undefined) as Partial<T>
}
export const setStoreValue = (key: string, value: object) => {
    STORE.set(prepareKey(key), value)
}
export const initStore = async () => {
    if (is.dev) {
        // 开发模式不记录持久化数据，清空后再初始化
        // STORE.clear()
    }
    const initFlag = STORE.get(`__INIT__`)
    if (!initFlag) {
        STORE.set(`__INIT__`, true)
        // 载入默认数据
        // DefaultConfig.forEach(v => {
        //     STORE.set(prepareKey(v.key), v.default)
        // })
    }

}


