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
