import { FailedResponse, SuccessResponse } from "@root-types/app";

const proxyHost = "https://xunfei-audio.vercel.app";

export const prepare = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch(`${proxyHost}/api/prepare`, options).then((res) => {
        return res.json();
    });

export const upload = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch(`${proxyHost}/api/upload`, options).then((res) => {
        return res.json();
    });

export const merge = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch(`${proxyHost}/api/merge`, options).then((res) => {
        return res.json();
    });

export const getProgress = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch(`${proxyHost}/api/getProgress`, options).then((res) => {
        return res.json();
    });

export const getResult = <T extends SuccessResponse | FailedResponse, U extends RequestInit>(options: U): Promise<T> =>
    fetch(`${proxyHost}/api/getResult`, options).then((res) => {
        return res.json();
    });
