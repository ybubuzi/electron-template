export enum ErrorCode {
    // 创建连接失败
    CREATE_CONNECT_ERROR,
    // 配置未找到
    CONF_NOT_FOUND

}


const ErrorFormat = {
    [ErrorCode.CREATE_CONNECT_ERROR]: '创建连接失败',
    [ErrorCode.CONF_NOT_FOUND]: '配置未找到',
}

export class EError extends Error {
    private vlas: any[]
    constructor(public code: ErrorCode, public interval: number = 100, ..._: any) {
        super()
        this.vlas = _
    }
    get message(): string {
        const msg = ErrorFormat[this.code]
        if (this.vlas.length > 0) {
            return `${msg}: ${this.vlas.join(', ')}`
        }
        if (msg) {
            return msg
        }
        return `未知错误`
    }
} 