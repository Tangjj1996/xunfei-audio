import ConfigStore, { ConfigType } from "./appConfig";

const config = new ConfigStore();

export interface StoreType {
    config: ConfigType;
}

const store: StoreType = {
    config,
};

export default store;
