import { FailedResponse, SuccessResponse } from "@root/types/app.config";

export const prepare = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch("https://raasr.xfyun.cn/api/prepare", options).then((res) => {
        return res.json();
    });

export const upload = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch("https://raasr.xfyun.cn/api/upload", options).then((res) => {
        return res.json();
    });

export const merge = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch("https://raasr.xfyun.cn/api/merge", options).then((res) => {
        return res.json();
    });

export const getProgress = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch("https://raasr.xfyun.cn/api/getProgress", options).then((res) => {
        return res.json();
    });

export const getResult = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch("https://raasr.xfyun.cn/api/getResult", options).then((res) => {
        return res.json();
    });
