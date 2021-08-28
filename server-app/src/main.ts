import Koa from "koa";
import proxyConfig from "./config";
import fetch from "node-fetch";
import Router from "koa-router";
import koaBody from "koa-body";
import { inspect } from "util";

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", ctx.req.headers.origin);
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Content-Length");
    ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    ctx.set("Access-Control-Allow-Credentials", "true");
    if (ctx.method === "OPTIONS") {
        ctx.body = 200;
    } else {
        await next();
    }
});

for (let key in proxyConfig) {
    router.post(key, koaBody(), async (ctx, next) => {
        console.log("This is occur req.url ", ctx.req.url);
        console.log("This is occur req.headers.content-type ", ctx.req.headers["content-type"], "\n");
        console.log("thie is request.body ", ctx.request.body);
        const rawFetchRes = await fetch(proxyConfig[key], {
            headers: {
                Host: "raasr.xfyun.cn",
                "Content-Type": ctx.req.headers["content-type"],
            },
            body: new URLSearchParams(ctx.request.body).toString(),
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
