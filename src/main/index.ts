import { app, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initBridge } from './bridge'
import ErrorNotify from '@main/notify/Error'
import { createMainWindow } from './window/MainWindow'
import { initStore } from '@main/utils/StoreUtils'
import { updateAppPath } from './utils/ApplicationUtils'
import { initLog } from '@main/utils/LogUtils'



/**
 * 屏蔽electron底层的一些警告,如GPU相关的警告
 * LOGGING_INFO = 0;
 * LOGGING_WARNING = 1;
 * LOGGING_ERROR = 2;
 * LOGGING_FATAL = 3;
 * LOGGING_NUM_SEVERITIES = 4;
*/
app.commandLine.appendSwitch('log-level', '3')
// app.commandLine.appendSwitch('trace-warnings');
// electron日志
// app.commandLine.appendSwitch('enable-logging')
updateAppPath()

app.whenReady().then(async () => {
  // 初始化日志打印
  initLog()
  // 初始化持久化数据
  await initStore()
  process.on('uncaughtException', function (error) {
    // Handle the error
    ErrorNotify.log(error)
  })
  process.on('unhandledRejection', function (error) {
    if (error instanceof Error) {
      // Handle the error
      ErrorNotify.log(error)
    }
  })
  // 判断是否二次打开
  if (!app.requestSingleInstanceLock()) {
    // 创建新主窗口
    createMainWindow()
    return
  }
  // 初始化主/渲进程的连接通道
  initBridge()
  // 开发环境下加载VUE devtool
  if (is.dev) {
    session.defaultSession.loadExtension(join(__dirname, `../../devtool`), { allowFileAccess: true })
    // @ts-ignore 设置程序ID,仅在开发模式下生效
    electronApp.setAppUserModelId(import.meta.env.APP_ID)
  } else {
    // 注册运行程序
    app.setAppUserModelId(process.execPath)
  }
  // 用于屏蔽F12与`Ctrl+Shift+I`快捷键打开开发者工具
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createMainWindow()
})


app.on('window-all-closed', () => {
  // MAC设备时处理
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 