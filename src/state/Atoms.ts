import { atom } from "recoil";
import { Configs } from "../models/Configs";
import { ModuleInfo } from "../models/ModuleInfo";

const defaultConfig: Configs = {
  apiConfig: "",
  apiConfigName: "",
  packageConfig: "",
  packageConfigName: "",
  packageConfigFilePath: "",
};

const defaultModuleInfo: ModuleInfo = {
  moduleName: "",
  moduleDescription: "",
  modulePath: "",
  moduleDependencies: "",
  serviceToEnable: "",
  serviceDescription: "",
  docPath: "",
  globalVariables: new Array<string>(),
  serviceVariables: new Array<string>()
};

export const Config = atom({
  key: "configList",
  default: defaultConfig,
});

export const Module = atom({
  key: "moduleInfo",
  default: defaultModuleInfo,
});
