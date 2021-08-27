#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const constance_1 = require("./constance");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const form_data_1 = __importDefault(require("form-data"));
const utils_1 = require("./utils");
const chalk_1 = __importDefault(require("chalk"));
let filePathLength = process.argv.length - 2;
const PostRequestData = (path, headers, data, form) => {
    return new Promise((resolve, reject) => {
        const whatWg = new url_1.default.URL(path);
        const req = https_1.default
            .request({
            path,
            method: "post",
            headers,
            hostname: whatWg.hostname,
            port: whatWg.port,
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
            form.getLength((err, length) => {
                req.setHeader("Content-length", length);
                form.pipe(req);
            });
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
async function bootStrap(i) {
    if (filePathLength <= 0) {
        utils_1.log(`\n已全部成功转写 ${chalk_1.default.greenBright(process.argv.length - 2)} 个文件`);
        process.exit(1);
    }
    utils_1.log(chalk_1.default.yellow(`正在进行语音转写 ${chalk_1.default.greenBright(process.argv.length - i - 1)} / ${chalk_1.default.greenBright(process.argv.length - 2)}\n`));
    const audioFilePath = path_1.default.resolve(process.cwd(), process.argv[process.argv.length - i]);
    if (!fs_1.default.existsSync(audioFilePath)) {
        utils_1.err("\n\nThe audio file is no exit!\n\n");
        process.exit(1);
    }
    else {
        utils_1.log(`恭喜！文件地址合法 当前文件路径 ${chalk_1.default.greenBright(audioFilePath)}`);
    }
    const CURRENT_TIME = Math.floor(Date.now() / 1000);
    const signa = createSign(CURRENT_TIME);
    try {
        // prepare interface
        const fileLen = fs_1.default.statSync(audioFilePath).size;
        const filename = path_1.default.basename(audioFilePath);
        const sliceNum = Math.ceil(fileLen / constance_1.FILE_PIECE_SICE);
        utils_1.log(`文件长度 ${chalk_1.default.greenBright(fileLen)} 文件名 ${chalk_1.default.greenBright(filename)} 分 ${chalk_1.default.greenBright(sliceNum)} 次上传`);
        utils_1.log(`开始调用前置接口 prepare `);
        const prepareRes = await PostRequestData("https://raasr.xfyun.cn/api/prepare", {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }, {
            app_id: constance_1.APP_ID,
            signa,
            ts: CURRENT_TIME,
            file_len: fileLen,
            file_name: filename,
            slice_num: sliceNum,
        });
        if (prepareRes.ok === 0) {
            utils_1.log(`调用前置接口成功 prepare 开始调用上传接口 upload`);
            // upload interface
            let start = 0, index = 0;
            const upload = async (fileLen) => {
                utils_1.log(`正在上传 ${chalk_1.default.greenBright(`${++index} / ${sliceNum}`)}`);
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
                    signa,
                    ts: CURRENT_TIME,
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
                utils_1.log(`文件上传成功 调用合并接口 merge`);
                const mergeRes = await PostRequestData("https://raasr.xfyun.cn/api/merge", {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                }, {
                    app_id: constance_1.APP_ID,
                    signa,
                    ts: CURRENT_TIME,
                    task_id: prepareRes.data,
                });
                if (mergeRes.ok === 0) {
                    utils_1.log(`合并成功 每 ${chalk_1.default.greenBright(5)} 秒 调用进度查询接口 getProgress`);
                    const progressFn = async () => {
                        return await PostRequestData("https://raasr.xfyun.cn/api/getProgress", {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        }, {
                            app_id: constance_1.APP_ID,
                            signa,
                            ts: CURRENT_TIME,
                            task_id: prepareRes.data,
                        });
                    };
                    const timer = setInterval(async () => {
                        const progressRes = await progressFn();
                        if (progressRes.ok === 0) {
                            utils_1.log("正在获取转码进度", JSON.stringify(progressRes));
                            if (JSON.parse(progressRes.data)?.status === 9) {
                                clearInterval(timer);
                                const getResultRes = await PostRequestData("https://raasr.xfyun.cn/api/getResult", {
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                }, {
                                    app_id: constance_1.APP_ID,
                                    signa: createSign(CURRENT_TIME),
                                    ts: CURRENT_TIME,
                                    task_id: prepareRes.data,
                                });
                                if (getResultRes.ok === 0) {
                                    const file = fs_1.default.createWriteStream(filename.slice(0, -4) + ".source.txt");
                                    file.write(constance_1.BANNER + getResultRes.data);
                                    file.end();
                                    file.on("finish", () => {
                                        utils_1.log(`源文件成功保存在 ${chalk_1.default.greenBright(filename.slice(0, -4) + ".source.txt")}`);
                                        bootStrap(--filePathLength);
                                    });
                                }
                            }
                        }
                        else if (progressRes.ok === -1) {
                            clearInterval(timer);
                            utils_1.err("调用失败了", JSON.stringify(progressRes));
                        }
                    }, 5000);
                }
            }
        }
    }
    catch (_) {
        utils_1.err("[PostRequestData]::net Error", _);
    }
}
((filePathLength) => {
    if (filePathLength <= 0) {
        utils_1.err("请提供文件地址");
        process.exit(1);
    }
    bootStrap(filePathLength);
})(filePathLength);
