/**
 * @Name: StoreService
 * @Author: bubuzi
 * @Date: 2023/08/01 16:36
 * @Version: 1.0.0
 * @Description: 用于处理渲染进程的持久化存储
 */
import { ServiceRegister, ServiceHandler } from '..'
import { getStoreValue, setStoreValue } from '@main/utils/StoreUtils'

/**
 * 注册持久化Store服务
 * todo:
 * 1. 多通道持久化的支持
 */
@ServiceRegister("store")
export default class StoreService {
    /**
     * 通过指定key获取持久化的值
     * @param {String} key 指定的key
     * @returns {Object|null} 返回对应的值
     */
    @ServiceHandler()
    getValue<T>(key: string): Partial<T> | null {
        return getStoreValue(key)
    }
    /**
     * 通过指定key设置持久化的值
     * @param {String} key 指定的key
     * @param {Object} value 指定的值
     * @returns {null}
     */
    @ServiceHandler()
    setValue(key: string, value: object): void {
        setStoreValue(key, value)
    }
}