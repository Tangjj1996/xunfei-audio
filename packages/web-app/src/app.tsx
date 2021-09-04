import React from "react";
import Nav from "./views/nav";
import Menu from "./views/menu";
import Footer from "./views/footer";
import XfTransform from "./views/xfTransform";

import classes from "./app.module.css";

const App = () => {
    return (
        <div className={classes.app}>
            <Menu className={classes["app-left"]}></Menu>
            <div className={classes["app-right"]}>
                <Nav></Nav>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default App;
