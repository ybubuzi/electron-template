import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { stat, mkdir } from 'fs/promises'
import log from 'electron-log'
/**
 * 获取exe文件所在目录
 * @returns 执行文件所在路径
 */
export const getExePath = () => {
    if (is.dev) {
        return join(__dirname, '..\\..')
    }
    const exeFullPath = app.getPath('exe')
    const exePath = exeFullPath.substring(0, exeFullPath.lastIndexOf('\\'))
    return exePath
}

export const updateAppPath = async () => {
    const userPath = `${getExePath()}\\data`
    log.info(`user data dir: ${userPath}`)
    await stat(userPath).catch(async () => {
        mkdir(userPath)
    })
    app.setPath('userData', userPath)
}

