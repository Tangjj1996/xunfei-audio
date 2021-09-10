import React from "react";
import { Link } from "react-router-dom";
import { Typography, MenuList, MenuItem, ListItemIcon } from "@material-ui/core";
import { Drafts } from "@material-ui/icons";
import clsx from "clsx";
import classes from "./menu.module.css";

interface Props {
    className: string;
}

const MenuWrap: React.FC<Props> = ({ className }) => {
    return (
        <MenuList className={clsx([className, classes.menu])}>
            <Link to="/transform">
                <MenuItem>
                    <ListItemIcon>
                        <Drafts />
                    </ListItemIcon>
                    <Typography>转写服务</Typography>
                </MenuItem>
            </Link>
        </MenuList>
    );
};

export default MenuWrap;
