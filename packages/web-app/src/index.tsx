import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { StoreContext } from "@hooks/useStore";
import store from "@store";

import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <StoreContext store={store}>
            <App />
        </StoreContext>
    </React.StrictMode>,
    document.getElementById("root")
);
