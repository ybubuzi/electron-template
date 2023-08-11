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
