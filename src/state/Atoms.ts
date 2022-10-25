import { atom } from "recoil";
import { Configs } from "../models/configs";

const defaultConfig: Configs = { apiConfig: '', apiConfigName: '', packageConfig: '', packageConfigName: ''};

export const Config = atom({
    key: "configList",
    default: defaultConfig,
  });