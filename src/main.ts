import { PrepareFetchUrl } from "./app.config";
import * as https from "https";

https
    .get(
        "https://raasr.xfyun.cn/api/prepare" as PrepareFetchUrl,
        {
            method: "post",
        },
        (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                console.log(JSON.parse(data));
            });
        }
    )
    .on("error", (err) => {
        console.error("Eorro::", err.message);
    });
