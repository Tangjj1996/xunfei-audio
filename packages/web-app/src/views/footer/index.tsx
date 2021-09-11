import React from "react";
import classes from "./footer.module.css";
import { Typography, Box } from "@material-ui/core";

const Footer = () => {
    return (
        <Box className={classes.footer}>
            <Typography color="textPrimary">@tangji 2021-present</Typography>
        </Box>
    );
};

export default Footer;
