/**
 * @Name: BootstrapUtils.ts
 * @Author: bubuzi
 * @Date: 2023/07/26 11:18
 * @Version: 1.0.0
 * @Description: 程序自启动工具
 */
import WinReg from 'winreg'

const RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
type RegCallback = (err: Error) => void
// 获取注册表
const getKey = () => {
    return new WinReg({
        hive: WinReg.HKCU,
        key: RUN_LOCATION
    })
}
// callback自定义方法，你可以在这里写代码
const nopp: RegCallback = (_: Error) => { }

/**
 * 设置程序自动启动
 * @param name 程序名称
 * @param exePath 执行文件路径
 * @param callback 
 */
export const enableAutoStart = (name: string, exePath: string, callback?: RegCallback) => {
    const kye = getKey()
    kye.set(name, WinReg.REG_SZ, exePath, callback || nopp)
}

/**
 * 禁用自动启动
 * @param name 程序名称
 * @param callback 
 */
export const disableAutoStart = (name: string, callback?: RegCallback) => {
    const kye = getKey()
    kye.remove(name, callback || nopp)
}

/**
 * 判断是否自动启动
 * @param name 
 * @param callback 
 * @returns 
 */
export const getAutoStartValue = (name: string, callback?: RegCallback): boolean => {
    const kye = getKey()
    const result = kye.get(name, callback || nopp)
    if (!result) return false
    return result.values[0].value === '1'
}