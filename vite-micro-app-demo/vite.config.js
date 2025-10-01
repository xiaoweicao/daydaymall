import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 启用manifest文件生成
    manifest: 'manifest.json',
    // 配置为库模式，适合微前端
    lib: {
      entry: 'src/main.jsx',
      name: 'ViteMicroApp',
      fileName: (format) => `micro-app.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});