/**
 * @Name: StoreUtils.ts
 * @Author: bubuzi
 * @Date: 2023/07/25 17:31
 * @Version: 1.0.0

* @Description: 管理electron-store，持久化存储数据
 */
import { is } from '@electron-toolkit/utils'
import Store from 'electron-store';
import DefaultConfig from '@common/Store/defaultConfig'
import { APP_CONFIG } from '@common/Store'
import { getExePath } from '@main/utils/ApplicationUtils'
import { EError, ErrorCode } from '@common/Error';

const STORE_MAP = new Map<string, Store<Record<string, unknown>>>()

const getStore = (group: string): Store<Record<string, unknown>> => {
    const store = STORE_MAP.get(group)
    if (!store) {
        throw new EError(ErrorCode.CONF_NOT_FOUND, 100, group)
    }
    return store
}
/**
 * 
 * @param key 
 */
export function getStoreValue<T>(key: string): Partial<T> | null;
export function getStoreValue<T>(group: string, key: string): Partial<T> | null;
export function getStoreValue<T>(...args: any[]): Partial<T> | null {
    let group = APP_CONFIG
    let key: string
    if (args.length > 2 || args.length == 0) {
        throw new Error(`Illegal Parameter`)
    }
    if (args.find(item => typeof (item) !== 'string')) {
        throw new Error(`Illegal Parameter`)
    }
    args = args as Array<string>
    if (args.length == 1) {
        key = args[0]
    } else {
        group = args[0]
        key = args[1]
    }
    return getStore(group).get(key, null) as Partial<T>
}
/**
 * 
 */
export function setStoreValue(key: string, value: object): void;
export function setStoreValue(group: string, key: string, value: object): void;
export function setStoreValue(...args: any[]): void {
    let group = APP_CONFIG
    let key: string
    let data: object
    if (args.length > 3 || args.length < 2) {
        throw new Error(`Illegal Parameter`)
    }
    if (typeof args[0] != 'string') {
        throw new Error(`Illegal Parameter`)
    }
    if (args.length == 2) {
        key = args[0]
        data = args[1]
    } else {
        if (typeof args[1] != 'string') {
            throw new Error(`Illegal Parameter`)
        }
        group = args[0]
        key = args[1]
        data = args[2]
    }
    getStore(group).set(key, data)
}


export const initStore = async () => {
    const rootPath = is.dev ? getExePath() + '/data' : getExePath()
    DefaultConfig.forEach(item => {
        const { key, fileName, data } = item
        const store = new Store({
            name: fileName ?? key,
            fileExtension: 'json',
            cwd: rootPath,
            clearInvalidConfig: true, // 配置出现异常时自动清除
        })
        STORE_MAP.set(key, store)
        if (is.dev) {
            // 开发模式不记录持久化数据，清空后再初始化
            store.clear()
        }

        const initFlag = store.get(`${item.key}.__INIT__`)
        if (!initFlag) {
            store.set(data)
            store.set(`${key}.__INIT__`, true)
        }

    })
}


