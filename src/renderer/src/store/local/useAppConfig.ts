import { defineStore } from 'pinia'
import { APP_CONFIG } from '@common/Store'

export const id = APP_CONFIG

// 第一个参数是应用程序中 store 的唯一 id
export const useAppConfigStore = defineStore<string, {
    message: string
}>(id, {
    state: () => {
        return {
            message: 'Hello World'
        }
    },
})