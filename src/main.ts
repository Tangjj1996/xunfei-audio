import {
    FailedResponse,
    GetProgressFetchUrl,
    GetResultFetchUrl,
    MergeFetchUrl,
    PostDataParam,
    PrepareFetchUrl,
    SuccessResponse,
    UploadFetchUrl,
} from "./app.config";
import https from "http";
import type http from "http";
import crypto from "crypto-js";
import { CURRENT_TIME, APP_ID, SECRET_KEY, FILE_PIECE_SICE, BANNER } from "./constance";
import fs from "fs";
import path from "path";
import url from "url";
import FormData from "form-data";

const audioFilePath = process.argv[2];

if (!fs.existsSync(process.cwd() + audioFilePath)) {
    console.log("\n\nThe audio file is no exit!\n\n");
    process.exit(1);
}

const PostRequestData = <
    T extends PrepareFetchUrl | UploadFetchUrl | MergeFetchUrl | GetProgressFetchUrl | GetResultFetchUrl
>(
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
                    headers: {
                        ...headers,
                        Host: whatWg.host,
                    },
                    hostname: "127.0.0.1",
                    port: 8866,
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
            form.pipe(req);
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

(async () => {
    try {
        // prepare interface
        const filepath = process.cwd() + audioFilePath;
        const fileLen = fs.statSync(filepath).size;
        const filename = path.basename(filepath);
        const prepareRes = await PostRequestData(
            "https://raasr.xfyun.cn/api/prepare",
            {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            {
                app_id: APP_ID,
                signa: createSign(CURRENT_TIME),
                ts: CURRENT_TIME,
                file_len: fileLen,
                file_name: filename,
                slice_num: 1,
            }
        );
        if (prepareRes.ok === 0) {
            // upload interface
            let start = 0;
            const upload = async (fileLen: number) => {
                let len = fileLen < FILE_PIECE_SICE ? fileLen : FILE_PIECE_SICE,
                    end = start + len - 1;
                const form = new FormData();
                const fileFragment = fs.createReadStream(filepath, {
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
                        signa: createSign(CURRENT_TIME),
                        ts: CURRENT_TIME,
                        task_id: prepareRes.data,
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
            const uploadRes: SuccessResponse | FailedResponse = await upload(fileLen);
            if (uploadRes.ok === 0) {
                const mergeRes = await PostRequestData(
                    "https://raasr.xfyun.cn/api/merge",
                    {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    {
                        app_id: APP_ID,
                        signa: createSign(CURRENT_TIME),
                        ts: CURRENT_TIME,
                        task_id: prepareRes.data,
                    }
                );
                if (mergeRes.ok === 0) {
                    const progressFn = async () => {
                        return await PostRequestData(
                            "https://raasr.xfyun.cn/api/getProgress",
                            {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            },
                            {
                                app_id: APP_ID,
                                signa: createSign(CURRENT_TIME),
                                ts: CURRENT_TIME,
                                task_id: prepareRes.data,
                            }
                        );
                    };
                    const timer = setInterval(async () => {
                        const progressRes: SuccessResponse | FailedResponse = await progressFn();
                        if (progressRes.ok === 0) {
                            if (JSON.parse(progressRes.data)?.status === 9) {
                                clearInterval(timer);
                                const getResultRes = await PostRequestData(
                                    "https://raasr.xfyun.cn/api/getResult",
                                    {
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    },
                                    {
                                        app_id: APP_ID,
                                        signa: createSign(CURRENT_TIME),
                                        ts: CURRENT_TIME,
                                        task_id: prepareRes.data,
                                    }
                                );
                                if (getResultRes.ok === 0) {
                                    const file = fs.createWriteStream(
                                        path.basename(process.cwd() + audioFilePath) + ".txt"
                                    );
                                    file.write(BANNER + getResultRes.data);
                                }
                            }
                        }
                    }, 1000);
                }
            }
        }
    } catch (_) {
        console.error("[PostRequestData]::net Error", _);
    }
})();
