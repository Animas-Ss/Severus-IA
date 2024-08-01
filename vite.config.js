import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';
//TODO: esto es inportante para configurar variables de entorno en proyectos frontend con tauri. probar en futuros proyectos
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  define: {
    'process.env': {
      ...process.env,
      GOOGLE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY
    }      

  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
