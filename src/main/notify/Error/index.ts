
import { NotifyRegister, NotifyHandler } from '..'

@NotifyRegister('error')
export default class ErrorAdvice {
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