import * as https from "https";
https
    .get("https://raasr.xfyun.cn/api/prepare", {}, (res) => {
    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });
    res.on("end", () => {
        console.log(JSON.parse(data));
    });
})
    .on("error", (err) => {
    console.error("Eorro::", err.message);
});
