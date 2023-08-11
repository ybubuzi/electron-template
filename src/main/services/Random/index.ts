/**
 * @Name: RandomService
 * @Author: bubuzi
 * @Date: 2023/08/01 16:36
 * @Version: 1.0.0
 * @Description: 用于测试注册服务
 */
import { ServiceRegister, ServiceHandler } from '..'

@ServiceRegister("random")
export default class RandomService {
    @ServiceHandler()
    randomNum(key) {
        const val = Math.random()
        return val
    }
}