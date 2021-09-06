import ConfigStore, { ConfigType } from "./appConfig";
import PreviewStore, { PreviewType } from "./preview";

const config = new ConfigStore();
const preview = new PreviewStore();

export interface StoreType {
    config: ConfigType;
    preview: PreviewType;
}

const store: StoreType = {
    config,
    preview,
};

export default store;
