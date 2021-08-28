import React from "react";
import { Button } from "@material-ui/core";
import { prepare } from "@src/api";

const urlParams = new URLSearchParams({
  app_id: "41ac2892",
});
const App: React.FC = () => {
  const handleClick = async () => {
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
