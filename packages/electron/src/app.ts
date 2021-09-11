import { BrowserWindow, app } from "electron";
import { server } from "@xf-audio/koa-server";

const successRes = {
    ok: 0,
};

const createWindow = () => {
    return new Promise(async (resolve, reject) => {
        const window = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nativeWindowOpen: true,
            },
        });
        await server();
        await window.loadURL("https://xunfei-audio.vercel.app");
        resolve(successRes);
    });
};

app.on("ready", async () => {
    try {
        await createWindow();
    } catch (_) {
        console.error(_);
    }
});
