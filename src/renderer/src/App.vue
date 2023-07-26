<script setup lang="ts">
import Versions from './components/Versions.vue'
import { useAppConfigStore } from '@renderer/store/local/useAppConfig'

const appConfigStore = useAppConfigStore()

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
