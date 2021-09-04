import React from "react";
import { LinearProgress } from "@material-ui/core";

interface Props {
    filename: string;
}

const ItemList: React.FC<Props> = ({ filename }) => {
    return (
        <div className="item-list-wrap">
            <span>{filename}</span>
            <LinearProgress variant="determinate"></LinearProgress>
        </div>
    );
};

export default ItemList;
