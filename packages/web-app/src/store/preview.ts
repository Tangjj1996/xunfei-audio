import { makeAutoObservable } from "mobx";
export interface PreviewType {
    isOpen: boolean;
    previewData: string;
    previewDataJson: [];

    changeOpen: (val: boolean) => void;
    changePreviewData: (val: string) => void;
}

class PreviewStore implements PreviewType {
    isOpen = true;
    previewData = `[{"bg":"1020","ed":"9740","onebest":"二物权的范围。一物上待、位性担保期间，担保财产毁损灭失或者被征收等","speaker":"0"},{"bg":"9740","ed":"17540","onebest":"担保物权人可以就获得的保险金、赔偿金或者补偿金等优先受偿二，","speaker":"0"},{"bg":"17540","ed":"23890","onebest":"以建设用地使用权抵押，以房地一体原则，以建筑物抵押的","speaker":"0"},{"bg":"23890","ed":"30530","onebest":"该建筑物占用范围内的建设用地使用权一并抵押，以建设用地使用权抵押的，","speaker":"0"},{"bg":"30530","ed":"38330","onebest":"该土地上的建筑物一并抵押。二，新增建筑物建设用地使用权抵押后，","speaker":"0"},{"bg":"38330","ed":"45200","onebest":"该土地上新增的建筑物不属于抵押财产，该建设用地使用权实现抵押权时，","speaker":"0"},{"bg":"45200","ed":"54200","onebest":"应当将该土地上新增的建筑物与建设用地使用权一并处分，但新增建筑物所得的价款抵押权人","speaker":"0"},{"bg":"54200","ed":"55640","onebest":"无权优先受偿。","speaker":"0"},{"bg":"55640","ed":"62290","onebest":"三、续建一，当事人仅以建设用地使用权抵押，","speaker":"0"},{"bg":"62290","ed":"70150","onebest":"债权人有权主张抵押权的效力，给予土地上已有的建筑物以及正在建造的建筑物已完成部分，","speaker":"0"},{"bg":"70460","ed":"78980","onebest":"债权人不得主张抵押权的效力，给予正在建造的建筑物的续建部分及新增建筑物。二，","speaker":"0"},{"bg":"78980","ed":"85970","onebest":"当事人已正在建造的建筑物抵押，抵押权的效力范围限于已办理抵押登记的部分，","speaker":"0"},{"bg":"86360","ed":"92260","onebest":"当事人按照担保合同的约定，主张抵押权的效力及续建部分，","speaker":"0"},{"bg":"92260","ed":"98200","onebest":"新增建筑物以及规划中尚未建造的建筑物的，人民法院不予支持。","speaker":"0"},{"bg":"98690","ed":"107370","onebest":"三、抵押人将建设用地使用权土地上的建筑物或者正在建造的建筑物分别抵押给不同债权人的，","speaker":"0"},{"bg":"107370","ed":"112470","onebest":"人民法院应当根据抵押登记的时间先后确定清偿顺序。","speaker":"0"}]`;
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
