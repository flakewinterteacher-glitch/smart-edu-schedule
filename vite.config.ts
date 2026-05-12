import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // เพิ่มบรรทัดนี้

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ตั้งค่าให้ @ ชี้ไปที่โฟลเดอร์ src
    },
  },
})