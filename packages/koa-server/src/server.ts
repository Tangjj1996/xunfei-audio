import Koa from "koa";
import proxyConfig from "./config";
import fetch from "node-fetch";
import Router from "koa-router";
import koaBody from "koa-body";
import FormData from "form-data";
import fs from "fs";

const app = new Koa();
const router = new Router();

export function server() {
    return new Promise((resolve, reject) => {
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
            router.post(key, koaBody({ multipart: key === "/api/upload" }), async (ctx, next) => {
                const isMutipart = key === "/api/upload";
                const formData = new FormData();

                if (isMutipart) {
                    for (let key in ctx.request.body) {
                        formData.append(key, ctx.request.body[key]);
                    }
                    for (let key in ctx.request.files) {
                        formData.append(key, fs.createReadStream(ctx.request.files[key]["path"]));
                    }
                }
                const rawFetchRes = await fetch(proxyConfig[key], {
                    body: isMutipart ? formData : new URLSearchParams(ctx.request.body),
                    method: "POST",
                });
                const jsonFetchRes = await rawFetchRes.json();
                ctx.body = jsonFetchRes;
                next();
            });
        }

        app.use(router.routes()).use(router.allowedMethods());

        app.listen(3000, () => {
            resolve({ ok: 0 });
            console.log("listener on 3000 successfully");
        });
    });
}
