import { makeAutoObservable } from "mobx";

export interface ConfigType {
    APP_ID: string;
    SECRET_KEY: string;
    FILE_PIECE_SIZE: number;

    changeAppId: (val: string) => void;
    changeSecretkey: (val: string) => void;
    changeFilePieceSize: (val: number) => void;
}

class ConfigStore implements ConfigType {
    APP_ID = "41ac2892";
    SECRET_KEY = "476dbac45bca3f32bba334f702e3bc4f";
    FILE_PIECE_SIZE = 1024 * 1024;

    constructor() {
        makeAutoObservable(this);
    }

    changeAppId(val) {
        this.APP_ID = val;
    }

    changeSecretkey(val) {
        this.SECRET_KEY = val;
    }

    changeFilePieceSize(val) {
        this.FILE_PIECE_SIZE = val;
    }
}

export default ConfigStore;
