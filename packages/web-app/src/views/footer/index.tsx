import React from "react";
import classes from "./index.module.css";
import { Typography, Box } from "@material-ui/core";

const Footer = () => {
    return (
        <Box className={classes.footer}>
            <Typography>This is Footer List</Typography>
        </Box>
    );
};

export default Footer;
