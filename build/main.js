#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const constance_1 = require("./constance");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const form_data_1 = __importDefault(require("form-data"));
const utils_1 = require("./utils");
let audioFilePath = path_1.default.resolve(process.cwd(), `${process.argv[2] || "10.m4a"}`);
if (!fs_1.default.existsSync(audioFilePath)) {
    utils_1.err("\n\nThe audio file is no exit!\n\n");
    process.exit(1);
}
const PostRequestData = (path, headers, data, form) => {
    return new Promise((resolve, reject) => {
        const whatWg = new url_1.default.URL(path);
        const req = http_1.default
            .request({
            path,
            method: "post",
            headers: {
                ...headers,
                Host: whatWg.host,
            },
            hostname: "127.0.0.1",
            port: 8866,
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
        if (headers["Content-Type"].match("application/x-www-form-urlencoded")) {
            const queryString = new url_1.default.URLSearchParams();
            for (let key in data) {
                queryString.append(key, String(data[key]));
            }
            req.write(queryString.toString());
            req.end();
        }
        else if (headers["Content-Type"].match("multipart/form-data")) {
            for (let key in data) {
                form.append(key, data[key]);
            }
            form.pipe(req);
        }
    });
};
const createSign = (ts) => {
    let md5 = crypto_js_1.default.MD5(constance_1.APP_ID + ts).toString();
    let sha1 = crypto_js_1.default.HmacSHA1(md5, constance_1.SECRET_KEY);
    let sign = crypto_js_1.default.enc.Base64.stringify(sha1);
    return sign;
};
class SliceIdGenerator {
    __ch;
    constructor(__ch = "") {
        this.__ch = __ch;
        this.__ch = "aaaaaaaaa`";
    }
    getNextSliceId() {
        let ch = this.__ch;
        let i = ch.length - 1;
        while (i >= 0) {
            let ci = ch[i];
            if (ci !== "z") {
                ch = ch.slice(0, i) + String.fromCharCode(ci.charCodeAt(0) + 1) + ch.slice(i + 1);
                break;
            }
            else {
                ch = ch.slice(0, i) + "a" + ch.slice(i + 1);
                i--;
            }
        }
        this.__ch = ch;
        return this.__ch;
    }
}
const sliceIdInstance = new SliceIdGenerator();
(async () => {
    try {
        // prepare interface
        const fileLen = fs_1.default.statSync(audioFilePath).size;
        const filename = path_1.default.basename(audioFilePath);
        const prepareRes = await PostRequestData("https://raasr.xfyun.cn/api/prepare", {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }, {
            app_id: constance_1.APP_ID,
            signa: createSign(constance_1.CURRENT_TIME),
            ts: constance_1.CURRENT_TIME,
            file_len: fileLen,
            file_name: filename,
            slice_num: 1,
        });
        if (prepareRes.ok === 0) {
            // upload interface
            let start = 0;
            const upload = async (fileLen) => {
                let len = fileLen < constance_1.FILE_PIECE_SICE ? fileLen : constance_1.FILE_PIECE_SICE, end = start + len - 1;
                const form = new form_data_1.default();
                const fileFragment = fs_1.default.createReadStream(audioFilePath, {
                    start,
                    end,
                });
                const uploadRes = await PostRequestData("https://raasr.xfyun.cn/api/upload", {
                    "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
                }, {
                    app_id: constance_1.APP_ID,
                    signa: createSign(constance_1.CURRENT_TIME),
                    ts: constance_1.CURRENT_TIME,
                    task_id: prepareRes.data,
                    slice_id: sliceIdInstance.getNextSliceId(),
                    content: fileFragment,
                }, form);
                if (uploadRes.ok === 0) {
                    start = end + 1;
                    fileLen -= len;
                    if (fileLen > 0) {
                        return await upload(fileLen);
                    }
                    else {
                        return uploadRes;
                    }
                }
            };
            const uploadRes = await upload(fileLen);
            if (uploadRes.ok === 0) {
                const mergeRes = await PostRequestData("https://raasr.xfyun.cn/api/merge", {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                }, {
                    app_id: constance_1.APP_ID,
                    signa: createSign(constance_1.CURRENT_TIME),
                    ts: constance_1.CURRENT_TIME,
                    task_id: prepareRes.data,
                });
                if (mergeRes.ok === 0) {
                    const progressFn = async () => {
                        return await PostRequestData("https://raasr.xfyun.cn/api/getProgress", {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        }, {
                            app_id: constance_1.APP_ID,
                            signa: createSign(constance_1.CURRENT_TIME),
                            ts: constance_1.CURRENT_TIME,
                            task_id: prepareRes.data,
                        });
                    };
                    const timer = setInterval(async () => {
                        const progressRes = await progressFn();
                        utils_1.log("正在获取转码进度", JSON.stringify(progressRes));
                        if (progressRes.ok === 0) {
                            if (JSON.parse(progressRes.data)?.status === 9) {
                                clearInterval(timer);
                                const getResultRes = await PostRequestData("https://raasr.xfyun.cn/api/getResult", {
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                }, {
                                    app_id: constance_1.APP_ID,
                                    signa: createSign(constance_1.CURRENT_TIME),
                                    ts: constance_1.CURRENT_TIME,
                                    task_id: prepareRes.data,
                                });
                                if (getResultRes.ok === 0) {
                                    const file = fs_1.default.createWriteStream(filename.slice(0, -4) + ".txt");
                                    file.write(constance_1.BANNER + getResultRes.data);
                                }
                            }
                        }
                    }, 5000);
                }
            }
        }
    }
    catch (_) {
        console.error("[PostRequestData]::net Error", _);
    }
})();
