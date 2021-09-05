import { makeAutoObservable } from "mobx";

interface PreviewType {
    isOpen: boolean;
    previewData: string;
    previewDataJson: object;

    changeOpen: (val: boolean) => void;
    changePreviewData: (val: string) => void;
}

class Preview implements PreviewType {
    isOpen = false;
    previewData = "";
    constructor() {
        makeAutoObservable(this);
    }
    get previewDataJson() {
        return this.previewData ? JSON.parse(this.previewData) : [];
    }
    changeOpen(val) {
        this.isOpen = val;
    }
    changePreviewData(val) {
        this.previewData = val;
    }
}

export default Preview;
