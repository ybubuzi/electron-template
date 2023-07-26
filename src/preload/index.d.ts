import { ElectronAPI } from '@electron-toolkit/preload'

type sendAPI = (channel: String, ...data: any) => void
type sendSyncApi = <T>(channel: string, ...data: any) => T
type invokeApi = (channel: string, ...data: any) => Promise<any>
type onApi = (channel: string, listener: (...args: any[]) => void) => void

type WindowApi = {
  send: sendAPI,
  sendSync: sendSyncApi,
  invoke: invokeApi,
  on: onApi,
  once: onApi,
  off: (channel: string, listener?: (...args: any[]) => void) => void,
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowApi
  }
}
