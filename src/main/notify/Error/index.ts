
/**
 * @Name: Notify/ErrorAdvice
 * @Author: bubuzi
 * @Date: 2023/08/15 12:01
 * @Version: 1.0.0
 * @Description: 用于主进程通知渲染进程错误信息
 */
import { NotifyRegister, NotifyHandler } from '..'

/**
 * 错误通知
 */
@NotifyRegister('error')
export default class ErrorAdvice {

    /**
     * 日志通知
     * @param {Error} err 错误对象
     * @returns {String} 将要输出至渲染进程的内容
     */
    @NotifyHandler({
        is_return: true,    // 这里如果为false，将直接把err整个对象发送至渲染进程
        type: 'error'
    })
    static log(err: Error) {
        if (err) {
            return err.message
        }
        return 'main error'
    }
}