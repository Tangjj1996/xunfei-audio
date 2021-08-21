import http from "http";
import crypto from "crypto-js";
import { CURRENT_TIME, APP_ID, SECRET_key } from "./constance";
const PostRequestData = (path, headers, data) => {
    return new Promise((resolve, reject) => {
        const req = http
            .request(path, {
            method: "post",
            headers,
            protocol: "http:",
            hostname: "127.0.0.1",
            port: "8866",
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                const parseData = JSON.parse(data);
                if (parseData.ok === 0) {
                    resolve(parseData);
                }
                else {
                    resolve(parseData);
                }
            });
        })
            .on("error", (err) => {
            reject(err);
        });
        req.write(JSON.stringify(data));
        req.end();
    });
};
const createSign = (ts) => {
    let md5 = crypto.MD5(APP_ID + ts).toString();
    let sha1 = crypto.HmacSHA1(md5, SECRET_key);
    let sign = crypto.enc.Base64.stringify(sha1);
    return sign;
};
try {
    const res = await PostRequestData("https://raasr.xfyun.cn/api/prepare", {
        "Content-Type": "application/x-www-form-urlencoded",
        charset: "UTF-8",
        Host: "raasr.xfyun.cn",
    }, {
        app_id: APP_ID,
        signa: createSign(CURRENT_TIME),
        ts: CURRENT_TIME,
        file_len: 1 << 10,
        file_name: "1.wav",
        slice_num: 1,
    });
    console.log(res);
}
catch (_) {
    console.error("[PostRequestData]::net Error", _);
}
