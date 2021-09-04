import React from "react";
import { Link } from "react-router-dom";
import { Typography, Box } from "@material-ui/core";

interface Props {
    className: string;
}

const MenuWrap: React.FC<Props> = ({ className }) => {
    return (
        <Box className={className}>
            <Link to="/transform">
                <Typography>转写服务</Typography>
            </Link>
        </Box>
    );
};

export default MenuWrap;
