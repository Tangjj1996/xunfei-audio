const { BrowserWindow, app } = require("electron");

const successRes = {
  ok: 0,
};

const createWindow = () => {
  return new Promise(async (resolve, reject) => {
    const window = new BrowserWindow({
      width: 1200,
      height: 800,
    });
    try {
      await window.loadURL("https://www.baidu.com");
      resolve(successRes);
    } catch (_) {
      reject(_);
    }
  });
};

app.on("ready", async () => {
  await createWindow();
});
