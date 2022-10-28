import { atom } from "recoil";
import { Configs } from "../models/Configs";
import { ModuleInfo, Variable } from "../models/ModuleInfo";

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
  globalVariables: new Array<Variable>(),
  serviceVariables: new Array<Variable>()
};

export const Config = atom({
  key: "configList",
  default: defaultConfig,
});

export const Module = atom({
  key: "moduleInfo",
  default: defaultModuleInfo,
});
