import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: any) => tag.includes('session')
        }
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://box-server.huyouyun.cn',
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
