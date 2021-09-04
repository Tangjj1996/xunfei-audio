import React from "react";
import Nav from "./views/nav";
import Menu from "./views/menu";
import Footer from "./views/footer";
import XfTransform from "./views/xfTransform";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import classes from "./app.module.css";

const App = () => {
    return (
        <BrowserRouter>
            <div className={classes.app}>
                <Menu className={classes["app-left"]}></Menu>
                <div className={classes["app-right"]}>
                    <Nav></Nav>
                    <Switch>
                        <Route path="/transform">
                            <XfTransform />
                        </Route>
                    </Switch>
                    <Footer></Footer>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
