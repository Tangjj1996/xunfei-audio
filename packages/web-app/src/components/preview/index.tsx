import React from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
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

    return (
        <Dialog open={store.preview.isOpen} onClose={() => store.preview.changeOpen(false)} scroll="paper">
            <DialogTitle>文档</DialogTitle>
            <DialogContent dividers={true}>
                <DialogContentText>
                    <TextView data={store.preview.previewDataJson}></TextView>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
});

export default Preview;
