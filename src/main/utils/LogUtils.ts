/**
 * @Name: LogUtils
 * @Author: bubuzi
 * @Date: 2023/10/13 10:12
 * @Version: 1.0.0
 * @Description: 用于处理主进程日志打印功能
 */
import { is } from '@electron-toolkit/utils'
import log from 'electron-log'
import moment from 'moment'
import { getExePath } from '@main/utils/ApplicationUtils'
const levelColorMap = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'magenta',
    verbose: 'white',
    silly: 'white'
}
export const initLog = () => {
    log.transports.file.resolvePath = () => {
        return `${getExePath()}/logs/main-${moment().format('MMDDHH')}.log`
    }
    if (!is.dev) {
        log.transports.file.level = 'info';
        // 日志控制台等级，默认值：false
        log.transports.console.level = 'debug';

    } else {
        log.transports.console.useStyles = true
        log.transports.file.level = 'debug';
        // 日志控制台等级，默认值：false
        log.transports.console.level = 'debug';
    }
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
    log.transports.console.format = (msg) => {
        // '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
        return [`%c[${moment().format("YY-MM-DD HH:mm:ss.SSS")}]  %c${msg.level} %c${msg.data.join(' ')}`,
            'color: magenta',
        `color: ${levelColorMap[msg.level]}`,
            'color: white',
        ]
    }
}