/**
 * @Name: StoreService
 * @Author: bubuzi
 * @Date: 2023/08/01 16:36
 * @Version: 1.0.0
 * @Description: 用于处理渲染进程的持久化存储
 */
import { ServiceRegister, ServiceHandler } from '..'
import { getStoreValue, setStoreValue } from '@main/utils/StoreUtils'

@ServiceRegister("store")
export default class StoreService {
    @ServiceHandler()
    getValue(key) {
        return getStoreValue(key)
    }
    @ServiceHandler()
    setValue(key, value) {
        return setStoreValue(key, value)
    }
}