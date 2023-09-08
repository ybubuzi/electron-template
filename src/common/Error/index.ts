export enum ErrorCode {
    // 创建连接失败
    CREATE_CONNECT_ERROR

}


const ErrorFormat = {
    [ErrorCode.CREATE_CONNECT_ERROR]: '创建连接失败',
}

export class EError extends Error {
    // private vlas: any[]
    constructor(public code: ErrorCode, public interval: number = 100, ..._: any) {
        super()
        // this.vlas = vals
    }
    get message(): string {
        const msg = ErrorFormat[this.code]
        if (msg) {
            return msg
        }
        return `未知错误`
    }
} 