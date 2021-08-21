import * as https from "https";
const PostRequestData = (path, headers, data) => {
    return new Promise((resolve, reject) => {
        const req = https
            .request(path, {
            method: "post",
            headers,
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
        req.write(JSON.stringify(data));
        req.end();
    });
};
try {
    const res = await PostRequestData("https://raasr.xfyun.cn/api/prepare", {
        "Content-Type": "application/x-www-form-urlencoded",
        charset: "UTF-8",
    }, {
        app_id: "41ac2892",
        signa: "",
        ts: String(Date.now()),
        file_len: 1 << 10,
        file_name: "1.ts",
        slice_num: 1,
    });
    console.log(res);
}
catch (_) {
    console.error("[PostRequestData]::net Error", _);
}
