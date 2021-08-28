import React from "react";
import { Button } from "@material-ui/core";
import { prepare } from "@src/api";
import CryptoJS from "crypto-js";

const APP_ID = "41ac2892";
const SECRET_KEY = "476dbac45bca3f32bba334f702e3bc4f";

const createSign = (ts: number): string => {
  let md5 = CryptoJS.MD5(APP_ID + ts).toString();
  let sha1 = CryptoJS.HmacSHA1(md5, SECRET_KEY);
  let sign = CryptoJS.enc.Base64.stringify(sha1);
  return sign;
};

const App: React.FC = () => {
  const handleClick = async () => {
    const time = Math.floor(Date.now() / 1000);
    const urlParams = new URLSearchParams({
      app_id: "41ac2892",
      signa: createSign(time),
      ts: String(time),
      file_len: "1000",
      file_name: "1.m4a",
      slice_num: "1",
    });
    const res = await prepare({
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: urlParams.toString(),
    });
  };

  return (
    <Button variant="contained" onClick={() => handleClick()}>
      上传文件
    </Button>
  );
};

export default App;
