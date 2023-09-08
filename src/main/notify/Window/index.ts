/**
 * @Name: WindowsNotify.ts
 * @Author: bubuzi
 * @Date: 2023/08/15 17:20
 * @Version: 1.0.0
 * @Description: 用于通知窗口改变的相关事件
 */
import { NotifyRegister, NotifyHandler } from '..'
import log from 'electron-log'
/**
 * 窗口事件通知
 */
@NotifyRegister('window')
export default class WindowsNotify {

    /**
     * 主窗口准备就绪
     * @param windowId 主窗口id
     */
    @NotifyHandler()
    static ready(windowId: number) {
        // 此处代码不会执行
        log.info(windowId)
    }
    /**
     * 主窗口最大化了
     * @param windowId 
     */
    @NotifyHandler()
    static maximize(windowId: number) {
        // 此处代码不会执行
        log.info(windowId)
    }
    /**
     * 主窗口取消最大化了
     * @param windowId 
     */
    @NotifyHandler()
    static unmaximize(windowId: number) {
        // 此处代码不会执行
        log.info(windowId)
    }
    /**
     * 主窗口最小化了
     * @param windowId
     */
    @NotifyHandler()
    static minimize(windowId: number) {
        // 此处代码不会执行
        log.info(windowId)
    }

    /**
     * Windows设备信息发生变动，一般在usb、蓝牙设备插入或拔出时触发
     */
    @NotifyHandler()
    static deviceChanged(windowId: number) {
        // 此处代码不会执行
        log.info(windowId)
    }
}