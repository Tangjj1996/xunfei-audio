import React, { useState } from "react";
import clsx from "clsx";
import { Box } from "@material-ui/core";
import classes from "./xftransform.module.css";

interface Props {}

const BorderDash: React.FC<Props> = ({ children }) => {
    const [isMouse, setMouse] = useState(false);
    const handleMouseEnter = () => {
        setMouse(true);
    };
    const handleMouseLeave = () => {
        setMouse(false);
    };

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={clsx(classes["content-box__boder"], isMouse ? classes["content-box__boder--enter"] : classes["content-bo__boder--leave"])}
        >
            {children}
        </Box>
    );
};

export default BorderDash;
