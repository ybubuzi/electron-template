/**
 * @Name: MainWindow.ts
 * @Author: bubuzi
 * @Date: 2023/08/15 14:30
 * @Version: 1.0.0
 * @Description: 用于提供创建程序主要窗口的工具
 */
import { join } from 'path'
import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import WindowsNotify from '@main/notify/Window'
import log from 'electron-log'
import type { BrowserWindowConstructorOptions } from 'electron'


// 默认主窗口配置
const DEFAULT_OPTION: BrowserWindowConstructorOptions = {
    // @ts-ignore   设置窗口名称
    title: import.meta.env.APP_NAME,
    width: 1280,            // 窗口宽度 
    height: 720,            // 窗口高度
    show: false,            // 创建后是否立刻显示   
    autoHideMenuBar: true,  // 自动隐藏菜单
    frame: false,           // 是否显示窗口边框
    minWidth: 1280,         // 窗口最小宽度
    minHeight: 720,         // 窗口最小高度
    webPreferences: {
        preload: join(__dirname, '../preload/index.js'),  // 预加载脚本
        sandbox: false      // 是否启用沙箱
    }
}


/**
 * 创建主窗口
 * @returns {BrowserWindow}
 */
export const createMainWindow = (): BrowserWindow => {
    const startTime = new Date().getTime()
    const window = new BrowserWindow(DEFAULT_OPTION)

    // 窗口预备后再显示
    window.once('ready-to-show', () => {
        const endTime = new Date().getTime()
        WindowsNotify.ready(window.id)
        window.show()
        log.info(`The Main Window Is Successfully Created, Which Takes: ${endTime - startTime} ms`)
    })

    // 窗口最大化通知
    window.on(`maximize`, () => {
        WindowsNotify.maximize(window.id)
    })


    // 窗口最小化通知
    window.on(`minimize`, () => {
        WindowsNotify.minimize(window.id)
    })

    // 窗口取消最大化通知
    window.on(`unmaximize`, () => {
        WindowsNotify.unmaximize(window.id)
    })
    // win32 hook，@see https://blog.csdn.net/qq_45720175/article/details/120536166
    const WM_DEVICECHANGE = 0x0219;
    window.hookWindowMessage(WM_DEVICECHANGE, (wParam, lParam) => {
        console.log(wParam, lParam)
        WindowsNotify.deviceChanged(window.id)
    })
    // window打开新窗口时的调用
    // 如在渲染进程中调用：window.open('https://www.baidu.com')
    // 此操作将导致url在新的窗口中打开
    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    // 区分开发环境与生产环境加载不同的页面
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        window.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return window
}