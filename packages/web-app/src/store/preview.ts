import { makeAutoObservable } from "mobx";
export interface PreviewType {
    isOpen: boolean;
    previewData: string;
    previewDataJson: [];

    changeOpen: (val: boolean) => void;
    changePreviewData: (val: string) => void;
}

class PreviewStore implements PreviewType {
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

export default PreviewStore;
