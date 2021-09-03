const { BrowserWindow, app } = require("electron");
const server = require("@xf-audio/koa-server");

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
    try {
      await window.loadURL("https://www.badidu.com");
      await server();
      resolve(successRes);
    } catch (_) {
      reject(_);
    }
  });
};

app.on("ready", async () => {
  try {
    await createWindow();
  } catch (_) {
    console.error(_);
  }
});
