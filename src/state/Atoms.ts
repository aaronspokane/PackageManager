import { atom } from "recoil";
import { Configs } from "../models/configs";

const defaultConfig: Configs = { apiConfig: '', packageConfig: ''};

export const configs = atom({
    key: "configList",
    default: defaultConfig,
  });