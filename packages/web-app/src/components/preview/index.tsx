import React, { MouseEvent, useState } from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem } from "@material-ui/core";
import { useContextStore } from "@hooks/useStore";
import { observer } from "mobx-react-lite";

interface DataType {
    bg: number;
    ed: number;
    onebest: string;
    speaker: number;
    si?: number;
    wordResultList?: string[];
    alternativeList?: string[];
    wordBg?: number;
    wordEd?: number;
    wordsName?: string;
    wc?: 0 | 1;
    wp?: "n" | "r" | "d" | "m" | "s" | "t" | "p" | "g";
}

const initialPos = {
    mouseX: null,
    mouseY: null,
};

const TextView = (props: { data: DataType[] }) => {
    return (
        <>
            {props.data.map((item, index) => (
                <div key={index}>{item.onebest}</div>
            ))}
        </>
    );
};

const Preview = observer(() => {
    const [store] = useContextStore();
    const [pos, setPos] = useState<{ mouseX: null | number; mouseY: null | number }>(initialPos);

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setPos({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = () => {
        setPos(initialPos);
    };
    return (
        <Dialog open={store.preview.isOpen} onClose={() => store.preview.changeOpen(false)} scroll="paper">
            <DialogTitle>转写文档（右键操作）</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText onContextMenu={handleClick}>
                    <TextView data={store.preview.previewDataJson}></TextView>
                </DialogContentText>
                <Menu
                    keepMounted
                    open={pos.mouseX !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={pos.mouseX !== null && pos.mouseY !== null ? { top: pos.mouseY, left: pos.mouseX } : undefined}
                >
                    <MenuItem onClick={handleClose}>复制</MenuItem>
                    <MenuItem onClick={handleClose}>打印</MenuItem>
                    <MenuItem onClick={handleClose}>高亮</MenuItem>
                    <MenuItem onClick={handleClose}>分享</MenuItem>
                </Menu>
            </DialogContent>
            <Button color="primary">编辑</Button>
        </Dialog>
    );
});

export default Preview;
