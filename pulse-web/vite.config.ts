import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['api.ecooikos.com'],
    // 加入這段設定
    proxy: {
      '/ws': {
        target: 'ws://127.0.0.1:3000', // 轉發到你的 Rust 後端
        changeOrigin: true,
        ws: true, // 關鍵：開啟 WebSocket 支援
      },
    },
  },
})
