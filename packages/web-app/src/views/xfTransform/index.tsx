import React, { useState } from "react";
import { Button, Box, List, ListItem, LinearProgress } from "@material-ui/core";
import clsx from "clsx";
import { getProgress, getResult, merge, prepare, upload } from "@api";
import CryptoJS from "crypto-js";
import useSyncCallback from "@hooks/useSyncCallback";
import type { FailedResponse, SuccessResponse } from "@root-types/app";
import classes from "./xftransform.module.css";
import BorderDash from "./borderDash";
import { useContextStore } from "@hooks/useStore";
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

const XfTransform: React.FC = () => {
    const [fileList, setFileList] = useState<FileList[] | null>(null);
    const [curFileList, setCurFileList] = useState<FileList>(null);
    const [isDisabled, setDisabled] = useState(false);
    const [store] = useContextStore();

    const stateSyncFn = useSyncCallback(async () => {
        const curFileListArr = Array.from(curFileList);
        const { APP_ID, SECRET_KEY, FILE_PIECE_SIZE } = store.config;

        const createSign = (ts: number): string => {
            let md5 = CryptoJS.MD5(APP_ID + ts).toString();
            let sha1 = CryptoJS.HmacSHA1(md5, SECRET_KEY);
            let sign = CryptoJS.enc.Base64.stringify(sha1);
            return sign;
        };

        for (let i = 0; i < curFileListArr.length; i++) {
            const time = Math.floor(Date.now() / 1000);
            const signa = createSign(time);
            const sliceIdInstance = new SliceIdGenerator();

            const prepareFn = (): Promise<SuccessResponse | FailedResponse> => {
                return new Promise(async (resolve, reject) => {
                    const result: SuccessResponse | FailedResponse = await prepare({
                        method: "POST",
                        mode: "cors",
                        body: new URLSearchParams({
                            app_id: APP_ID,
                            signa: signa,
                            ts: String(time),
                            file_len: String(curFileList[i].size),
                            file_name: curFileList[i].name,
                            slice_num: String(Math.ceil(curFileList[i].size / FILE_PIECE_SIZE)),
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
                        const fileLen = curFileListArr[i].size < FILE_PIECE_SIZE ? curFileListArr[i].size : FILE_PIECE_SIZE;
                        const end = start + fileLen;
                        const formData = new FormData();

                        formData.append("app_id", APP_ID);
                        formData.append("ts", String(time));
                        formData.append("signa", createSign(time));
                        formData.append("task_id", data);
                        formData.append("slice_id", sliceIdInstance.getNextSliceId());
                        formData.append("content", curFileListArr[i].slice(start, end < curFileListArr[i].size ? end : curFileListArr[i].size));

                        let result: SuccessResponse | FailedResponse = await upload({
                            method: "POST",
                            mode: "cors",
                            body: formData,
                        });

                        start = end;

                        if (end > FILE_PIECE_SIZE) {
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
                    const result: SuccessResponse | FailedResponse = await merge({
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
                        const result: SuccessResponse | FailedResponse = await getProgress({
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
                    const result: SuccessResponse | FailedResponse = await getResult({
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
                await upLoadFn(resultPrepare.data);
                await mergeFn(resultPrepare.data);
                await getProgressFn(resultPrepare.data);
                const resultGetResult = await getresultFn(resultPrepare.data);
                /**
                 * @description download
                 */
                const aLink = document.createElement("a") as HTMLAnchorElement;
                const body = document.querySelector("body");
                const fileBlob = new Blob([resultGetResult.data]);
                aLink.href = window.URL.createObjectURL(fileBlob);
                aLink.download = "audio_to_file.txt";
                aLink.style.display = "none";
                body.appendChild(aLink);
                aLink.click();
                body.removeChild(aLink);
                window.URL.revokeObjectURL(aLink.href);
            } catch (_) {
                console.error(_);
            }
            setDisabled(false);
        }
    });

    const handleClick = async () => {
        const inputRef = document.createElement("input") as HTMLInputElement;
        inputRef.type = "file";
        inputRef.accept = "audio/*";
        inputRef.multiple = true;
        inputRef.click();
        inputRef.onchange = function (e) {
            setDisabled(true);
            setFileList((pre) => (pre === null ? [(this as HTMLInputElement).files] : [...pre, (this as HTMLInputElement).files]));
            setCurFileList((this as HTMLInputElement).files);
            stateSyncFn();
        };
    };

    return (
        <Box className={clsx(classes.content)}>
            <Box className={clsx(classes["contetn-box"])}>
                <BorderDash>
                    <Button disabled>拖拽上传</Button>
                </BorderDash>
                <Button style={{ marginTop: 20 }} variant="contained" color="primary" onClick={() => handleClick()} disabled={isDisabled}>
                    上传文件
                </Button>
            </Box>
            <List>
                {fileList &&
                    fileList.map((item) =>
                        Array.from(item).map((file, index) => (
                            <ListItem key={index}>
                                <Box>{file.name}</Box>
                                <LinearProgress variant="determinate" value={100} style={{ width: 110 }}></LinearProgress>
                                <Button variant="contained" onClick={() => {}}>
                                    预览
                                </Button>
                            </ListItem>
                        ))
                    )}
            </List>
        </Box>
    );
};

export default XfTransform;
