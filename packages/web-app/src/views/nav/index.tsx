import React from "react";
import classes from "./nav.module.css";
import { Typography, Box } from "@material-ui/core";

const Nav = () => {
    return (
        <Box className={classes.nav}>
            <Typography>This is nav List</Typography>
        </Box>
    );
};

export default Nav;
