import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                start: resolve(__dirname, "index.html"),
                add: resolve(__dirname, "add.html"),
                login: resolve(__dirname, "login.html")
            }
        }
    },
    css: {
        devSourcemap: true
    }
});