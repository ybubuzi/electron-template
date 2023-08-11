import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, splitVendorChunkPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import type { UserConfig } from 'electron-vite'

// @ts-ignore 忽略cf未使用检查
export default defineConfig((cfg) => {
  // 开放资源文件夹
  const publicDir = resolve('resources')
  // 环境变量文件夹
  const envDir = resolve('env')

  const config: UserConfig = {
    main: {
      resolve: {
        alias: {
          "@common": resolve("src/common"),
          "@main": resolve("src/main"),
        },
      },
      plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    },
    preload: {
      resolve: {
        alias: {
          "@common": resolve("src/common"),
        }
      },
      plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    },
    renderer: {
      publicDir,
      envDir,
      envPrefix: 'RENDERER_',
      resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@common': resolve('src/common')
        },
      },
      optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis'
          },
          // Enable esbuild polyfill plugins
          plugins: [
            NodeGlobalsPolyfillPlugin({
              buffer: true
            })
          ]
        }
      },
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
          }
        }
      },
      plugins: [vue(), splitVendorChunkPlugin(), , bytecodePlugin()]
    }
  }
  return config
})


