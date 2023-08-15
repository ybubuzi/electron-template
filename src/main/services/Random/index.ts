/**
 * @Name: RandomService
 * @Author: bubuzi
 * @Date: 2023/08/01 16:36
 * @Version: 1.0.0
 * @Description: 用于测试注册服务
 */
import { ServiceRegister, ServiceHandler } from '..'

/**
 * 注册一个随机数通知服务
 */
@ServiceRegister("random")
export default class RandomService {
    /**
     * 获取一个随机数，并通知渲染进程
     */
    @ServiceHandler()
    randomNum() {
        const val = Math.random()
        return val
    }
}