import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { StoreContext } from "@hooks/useStore";
import store from "@store";

import "./index.css";

// 禁用右键
document.oncontextmenu = (e) => {
    e.preventDefault();
};

ReactDOM.render(
    <StoreContext store={store}>
        <App />
    </StoreContext>,
    document.getElementById("root")
);
