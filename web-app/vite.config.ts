import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

export default defineConfig({
    plugins: [reactRefresh()],
    resolve: {
        alias: [
            {
                find: "@root",
                replacement: path.resolve(__dirname, "../"),
            },
            {
                find: "@src",
                replacement: path.resolve(__dirname, "src"),
            },
        ],
    },
    server: {
        port: 8080,
    },
});
