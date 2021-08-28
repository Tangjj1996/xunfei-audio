import Koa from "koa";
import proxyConfig from "./config";
import fetch from "node-fetch";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

for (let key in proxyConfig) {
    router.post(key, (ctx) => {
        fetch(proxyConfig[key], {
            headers: {
                host: "raasr.xfyun.cn",
                referer: "https://raasr.xfyun.cn",
            },
        }).then((res) => {
            return res.json();
        });
    });
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log("listener on 3000 successfully");
});
