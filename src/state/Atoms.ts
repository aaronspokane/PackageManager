import { atom } from "recoil";
import { Configs } from "../models/Configs";
import { ModuleInfo } from "../models/ModuleInfo";

const defaultConfig: Configs = {
  apiConfig: "",
  apiConfigName: "",
  packageConfig: "",
  packageConfigName: "",
};

const defaultModuleInfo: ModuleInfo = {
  moduleName: "",
  moduleDescription: "",
  modulePath: "",
};

export const Config = atom({
  key: "configList",
  default: defaultConfig,
});

export const Module = atom({
  key: "moduleInfo",
  default: defaultModuleInfo,
});
