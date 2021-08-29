import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { getProgress, getResult, merge, prepare, upload } from "@src/api";
import CryptoJS from "crypto-js";
import useSyncCallback from "@src/hooks/useSyncCallback";
import type { FailedResponse, SuccessResponse } from "@root/types/app.config";

const APP_ID = "41ac2892";
const SECRET_KEY = "476dbac45bca3f32bba334f702e3bc4f";
const FILE_PIECE_SICE = 1024 * 1024;

const createSign = (ts: number): string => {
    let md5 = CryptoJS.MD5(APP_ID + ts).toString();
    let sha1 = CryptoJS.HmacSHA1(md5, SECRET_KEY);
    let sign = CryptoJS.enc.Base64.stringify(sha1);
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

const App: React.FC = () => {
    const [fileList, setFileList] = useState<FileList[] | null>(null);
    const [curFileList, setCurFileList] = useState<FileList>(null);

    const stateSyncFn = useSyncCallback(async () => {
        const curFileListArr = Array.from(curFileList);
        for (let i = 0; i < curFileListArr.length; i++) {
            const time = Math.floor(Date.now() / 1000);
            const signa = createSign(time);
            const sliceIdInstance = new SliceIdGenerator();

            const prepareFn = (): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    const result = await prepare({
                        method: "POST",
                        mode: "cors",
                        body: new URLSearchParams({
                            app_id: APP_ID,
                            signa: signa,
                            ts: String(time),
                            file_len: String(curFileList[i].size),
                            file_name: curFileList[i].name,
                            slice_num: String(Math.ceil(curFileList[i].size / FILE_PIECE_SICE)),
                        }),
                    });
                    if (result.ok === 0) {
                        resolve(result);
                    } else {
                        reject({ ...result, stack: "prepare" });
                    }
                });
            };

            const upLoadFn = (data: string): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    let start = 0;
                    const loopUpload = async (): Promise<SuccessResponse | FailedResponse> => {
                        const fileLen = curFileListArr[i].size < FILE_PIECE_SICE ? curFileListArr[i].size : FILE_PIECE_SICE;
                        const end = start + fileLen;
                        const formData = new FormData();
                        console.log(`fileLen:: ${curFileListArr[i].size} FILE_PIECE_SICE:: ${FILE_PIECE_SICE} start:: ${start} end:: ${end}`);
                        formData.append("app_id", APP_ID);
                        formData.append("ts", String(time));
                        formData.append("signa", createSign(time));
                        formData.append("task_id", data);
                        formData.append("slice_id", sliceIdInstance.getNextSliceId());
                        formData.append("content", curFileListArr[i].slice(start, end < curFileListArr[i].size ? end : curFileListArr[i].size));

                        let result = await upload({
                            method: "POST",
                            mode: "cors",
                            body: formData,
                        });

                        start = end;

                        if (end > FILE_PIECE_SICE) {
                            return result;
                        } else {
                            return await loopUpload();
                        }
                    };
                    const result = await loopUpload();
                    if (result.ok === 0) {
                        resolve(result);
                    } else {
                        reject({ ...result, stack: "upload" });
                    }
                });
            };

            const mergeFn = (data: string): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    const result = await merge({
                        method: "POST",
                        mode: "cors",
                        body: new URLSearchParams({
                            app_id: APP_ID,
                            signa,
                            ts: String(time),
                            task_id: data,
                        }),
                    });
                    if (result.ok === 0) {
                        resolve(result);
                    } else {
                        reject({ ...result, stack: "merge" });
                    }
                });
            };

            const getProgressFn = (data: string): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    const timer = setInterval(async () => {
                        const result = await getProgress({
                            method: "POST",
                            mode: "cors",
                            body: new URLSearchParams({
                                app_id: APP_ID,
                                signa,
                                ts: String(time),
                                task_id: data,
                            }),
                        });
                        if (result.ok === 0) {
                            if (JSON.parse(result.data)?.status === 9) {
                                resolve(result);
                                clearInterval(timer);
                            }
                        } else {
                            clearInterval(timer);
                            reject({ ...result, stack: "getProgress" });
                        }
                    }, 5000);
                });
            };

            const getresultFn = (data: string): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    const result = await getResult({
                        method: "POST",
                        mode: "cors",
                        body: new URLSearchParams({
                            app_id: APP_ID,
                            signa,
                            ts: String(time),
                            task_id: data,
                        }),
                    });
                    if (result.ok === 0) {
                        resolve(result);
                    } else {
                        reject({ ...result, stack: "getResult" });
                    }
                });
            };

            try {
                const resultPrepare = await prepareFn();
                const resultUpload = await upLoadFn(resultPrepare.data);
                const resultMerge = await mergeFn(resultPrepare.data);
                const resultGetProgress = await getProgressFn(resultPrepare.data);
                const resultGetResult = await getresultFn(resultPrepare.data);
            } catch (_) {
                console.error(_);
            }
        }
    });

    const handleClick = async () => {
        const inputRef = document.createElement("input") as HTMLInputElement;
        inputRef.type = "file";
        inputRef.accept = "audio/*";
        inputRef.multiple = true;
        inputRef.click();
        inputRef.onchange = async function (e) {
            setFileList((pre) => (pre === null ? [(this as HTMLInputElement).files] : [...pre, (this as HTMLInputElement).files]));
            setCurFileList((this as HTMLInputElement).files);
            stateSyncFn();
        };
    };

    return (
        <>
            <Button variant="contained" onClick={() => handleClick()}>
                上传文件
            </Button>
            {fileList && fileList.map((aItem) => Array.from(aItem).map((item, index) => <div key={index}>{item.name}</div>))}
        </>
    );
};

export default App;
