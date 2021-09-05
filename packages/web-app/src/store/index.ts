import configStore, { AppConfig } from "./appConfig";

const config = new configStore();

export interface StoreType {
    config: AppConfig;
}

const store: StoreType = {
    config,
};

export default store;
