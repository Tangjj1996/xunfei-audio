import Koa from "koa";
import proxyConfig from "./config";
import fetch from "node-fetch";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Content-Length");
    ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    if (ctx.method === "OPTIONS") {
        ctx.body = 200;
    } else {
        await next();
    }
});

for (let key in proxyConfig) {
    router.post(key, async (ctx, next) => {
        console.log("This is occur req.url ", ctx.req.url);
        console.log("This is occur req.headers.content-type ", ctx.req.headers["content-type"]);
        const result: string | Buffer = await new Promise((resolve) => {
            let chunks = [];
            ctx.req.on("data", (chunk) => {
                chunks.push(chunk);
            });
            ctx.req.on("end", () => {
                console.log(chunks.join(""), "------------");
                resolve(chunks.join(""));
            });
        });
        const rawFetchRes = await fetch(proxyConfig[key], {
            headers: {
                Host: "raasr.xfyun.cn",
                "Content-Type": ctx.req.headers["content-type"],
            },
            body: result,
            method: "POST",
        });
        const jsonFetchRes = await rawFetchRes.json();
        ctx.body = jsonFetchRes;
        next();
    });
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log("listener on 3000 successfully");
});
