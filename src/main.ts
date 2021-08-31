#!/usr/bin/env node
import type { FailedResponse, GetProgressFetchUrl, GetResultFetchUrl, MergeFetchUrl, PostDataParam, PrepareFetchUrl, SuccessResponse, UploadFetchUrl } from "../types/app.config";
import https from "https";
import type http from "http";
import crypto from "crypto-js";
import { APP_ID, SECRET_KEY, FILE_PIECE_SICE, BANNER } from "./constance";
import fs from "fs";
import path from "path";
import url from "url";
import FormData from "form-data";
import { err, log } from "./utils";
import chalk from "chalk";

let filePathLength = process.argv.length - 2;

const PostRequestData = <T extends PrepareFetchUrl | UploadFetchUrl | MergeFetchUrl | GetProgressFetchUrl | GetResultFetchUrl>(
    path: T,
    headers: http.OutgoingHttpHeaders,
    data: PostDataParam<T>,
    form?: FormData
) => {
    return new Promise<SuccessResponse | FailedResponse>((resolve, reject) => {
        const whatWg = new url.URL(path);
        const req = https
            .request(
                {
                    path,
                    method: "post",
                    headers,
                    hostname: whatWg.hostname,
                    port: whatWg.port,
                },
                (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });

                    res.on("end", () => {
                        const parseData: SuccessResponse | FailedResponse = JSON.parse(data);
                        if (parseData.ok === 0) {
                            resolve(parseData as SuccessResponse);
                        } else {
                            resolve(parseData as FailedResponse);
                        }
                    });
                }
            )
            .on("error", (err) => {
                reject(err);
            });
        if ((headers["Content-Type"] as string).match("application/x-www-form-urlencoded")) {
            const queryString = new url.URLSearchParams();
            for (let key in data) {
                queryString.append(key, String(data[key]));
            }
            req.write(queryString.toString());
            req.end();
        } else if ((headers["Content-Type"] as string).match("multipart/form-data")) {
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

const createSign = (ts: number): string => {
    let md5 = crypto.MD5(APP_ID + ts).toString();
    let sha1 = crypto.HmacSHA1(md5, SECRET_KEY);
    let sign = crypto.enc.Base64.stringify(sha1);
    return sign;
};

class SliceIdGenerator {
    constructor(public __ch = "") {
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
            } else {
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
        log(`\n已全部成功转写 ${chalk.greenBright(process.argv.length - 2)} 个文件`);
        process.exit(1);
    }
    log(chalk.yellow(`正在进行语音转写 ${chalk.greenBright(process.argv.length - i - 1)} / ${chalk.greenBright(process.argv.length - 2)}\n`));
    const audioFilePath = path.resolve(process.cwd(), process.argv[process.argv.length - i]);
    if (!fs.existsSync(audioFilePath)) {
        err("\n\nThe audio file is no exit!\n\n");
        process.exit(1);
    } else {
        log(`恭喜！文件地址合法 当前文件路径 ${chalk.greenBright(audioFilePath)}`);
    }

    const CURRENT_TIME = Math.floor(Date.now() / 1000);
    const signa = createSign(CURRENT_TIME);
    const fileLen = fs.statSync(audioFilePath).size;
    const filename = path.basename(audioFilePath);
    const sliceNum = Math.ceil(fileLen / FILE_PIECE_SICE);

    log(`文件长度 ${chalk.greenBright(fileLen)} 文件名 ${chalk.greenBright(filename)} 分 ${chalk.greenBright(sliceNum)} 次上传`);
    log(`开始调用前置接口 prepare `);

    const prepareFn = (): Promise<SuccessResponse | FailedResponse> => {
        return new Promise(async (resolve, reject) => {
            const result = await PostRequestData(
                "https://raasr.xfyun.cn/api/prepare",
                {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                {
                    app_id: APP_ID,
                    signa,
                    ts: CURRENT_TIME,
                    file_len: fileLen,
                    file_name: filename,
                    slice_num: sliceNum,
                }
            );
            if (result.ok === 0) {
                resolve(result);
            } else {
                reject(JSON.stringify({ ...result, stack: "prepare" }));
            }
        });
    };

    const uploadFn = (data): Promise<SuccessResponse | FailedResponse> => {
        return new Promise(async (resolve, reject) => {
            log(`调用前置接口成功 prepare 开始调用上传接口 upload`);
            // upload interface
            let start = 0,
                index = 0;
            const upload = async (fileLen: number): Promise<SuccessResponse | FailedResponse> => {
                log(`正在上传 ${chalk.greenBright(`${++index} / ${sliceNum}`)}`);
                let len = fileLen < FILE_PIECE_SICE ? fileLen : FILE_PIECE_SICE,
                    end = start + len - 1;
                const form = new FormData();
                const fileFragment = fs.createReadStream(audioFilePath, {
                    start,
                    end,
                });
                const uploadRes = await PostRequestData(
                    "https://raasr.xfyun.cn/api/upload",
                    {
                        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
                    },
                    {
                        app_id: APP_ID,
                        signa,
                        ts: CURRENT_TIME,
                        task_id: data,
                        slice_id: sliceIdInstance.getNextSliceId(),
                        content: fileFragment,
                    },
                    form
                );
                if (uploadRes.ok === 0) {
                    start = end + 1;
                    fileLen -= len;

                    if (fileLen > 0) {
                        return await upload(fileLen);
                    } else {
                        return uploadRes;
                    }
                }
            };
            const result = await upload(fileLen);
            if (result.ok === 0) {
                resolve(result);
            } else {
                reject(JSON.stringify({ ...result, stack: "upload" }));
            }
        });
    };

    const mergeFn = (data): Promise<SuccessResponse | FailedResponse> => {
        return new Promise(async (resolve, reject) => {
            log(`文件上传成功 调用合并接口 merge`);
            const result = await PostRequestData(
                "https://raasr.xfyun.cn/api/merge",
                {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                {
                    app_id: APP_ID,
                    signa,
                    ts: CURRENT_TIME,
                    task_id: data,
                }
            );
            if (result.ok === 0) {
                resolve(result);
            } else {
                reject(JSON.stringify({ ...result, stack: "merge" }));
            }
        });
    };

    const getProgressFn = (data): Promise<SuccessResponse | FailedResponse> => {
        return new Promise((resolve, reject) => {
            log(`合并成功 每 ${chalk.greenBright(5)} 秒 调用进度查询接口 getProgress`);
            const timer = setInterval(async () => {
                const result = await PostRequestData(
                    "https://raasr.xfyun.cn/api/getProgress",
                    {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    {
                        app_id: APP_ID,
                        signa,
                        ts: CURRENT_TIME,
                        task_id: data,
                    }
                );
                if (result.ok === 0) {
                    log("正在获取转码进度", JSON.stringify(result));
                    if (JSON.parse(result.data)?.status === 9) {
                        clearInterval(timer);
                        resolve(result);
                    }
                } else {
                    clearInterval(timer);
                    err("调用失败了", JSON.stringify(result));
                    reject(JSON.stringify({ ...result, stack: "progress" }));
                }
            }, 5000);
        });
    };

    const getResultFn = (data): Promise<SuccessResponse | FailedResponse> => {
        return new Promise(async (resolve, reject) => {
            const result = await PostRequestData(
                "https://raasr.xfyun.cn/api/getResult",
                {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                {
                    app_id: APP_ID,
                    signa: createSign(CURRENT_TIME),
                    ts: CURRENT_TIME,
                    task_id: data,
                }
            );
            if (result.ok === 0) {
                resolve(result);
            } else {
                reject(JSON.stringify({ ...result, stack: "result" }));
            }
        });
    };

    try {
        const prepareRes = await prepareFn();
        await uploadFn(prepareRes.data);
        await mergeFn(prepareRes.data);
        await getProgressFn(prepareRes.data);
        const result = await getResultFn(prepareRes.data);

        fs.mkdir("xf-audio-source", () => {
            const file = fs.createWriteStream(process.cwd() + "/xf-audio-source/" + filename.slice(0, -4) + ".txt");
            file.write(BANNER + result.data);
            file.end();
            file.on("finish", () => {
                log(`源文件成功保存在 ${chalk.greenBright(process.cwd() + "/xf-audio-source/" + filename.slice(0, -4) + ".txt")}`);
                bootStrap(--filePathLength);
            });
        });
    } catch (_) {
        err(_);
    }
}

((filePathLength) => {
    if (filePathLength <= 0) {
        err("请提供文件地址");
        process.exit(1);
    }
    bootStrap(filePathLength);
})(filePathLength);
