import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

export default defineConfig({
    plugins: [reactRefresh()],
    resolve: {
        alias: [
            {
                find: "@api",
                replacement: path.resolve(__dirname, "src/api"),
            },
            {
                find: "@hooks",
                replacement: path.resolve(__dirname, "src/hooks"),
            },
        ],
    },
    server: {
        port: 8080,
    },
});
