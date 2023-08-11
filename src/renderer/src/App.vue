<script setup lang="ts">
import Versions from './components/Versions.vue'
import { useAppConfigStore } from '@renderer/store/local/useAppConfig'

const appConfigStore = useAppConfigStore()

// 主进程主动发送至渲染进程
window.notify.error.log((event) => {
  if (event) {
    console.log(event.type, event.message)
  }
})

// 渲染进程通过ipc调用主进程函数
setInterval(() => {
  window.service.random.randomNum().then((res) => {
    console.log(`render call main`, res)
  })
}, 1000)

</script>

<template>
  <Versions></Versions>

  <div>
    <h1>
      {{ appConfigStore.message }}
    </h1>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
