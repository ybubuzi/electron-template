/**
 * @Name: preload.d.ts
 * @Author: bubuzi
 * @Date: 2023/08/15 11:52
 * @Version: 1.0.0
 * @Description: 用于处理渲染进程的代码约束
 */
import { ElectronAPI } from '@electron-toolkit/preload'
import { Preload } from '@common/@types'


declare global {
  interface Window {
    electron: ElectronAPI
    api: Preload.WindowApi,
    service: Preload.Service
    notify: Preload.Notify
  }
}
