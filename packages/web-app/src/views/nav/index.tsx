import React from "react";
import classes from "./nav.module.css";
import { Avatar, Box } from "@material-ui/core";

const Nav = () => {
    return (
        <Box className={classes.nav}>
            <Avatar></Avatar>
        </Box>
    );
};

export default Nav;
