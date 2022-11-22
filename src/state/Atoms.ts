import { atom } from "recoil";
import { Configs } from "../models/Configs";
import { ModuleInfo, Variable } from "../models/ModuleInfo";
import { Wiki} from "../models/Wiki";
import { v4 as uuidv4 } from 'uuid';

const defaultConfig: Configs = {
  apiConfig: "",
  apiConfigName: "",
  packageConfig: "",
  packageConfigName: "",
  packageConfigFilePath: "",
};

export const defaultModuleInfo: ModuleInfo = {
  moduleName: "",
  moduleDescription: "",
  modulePath: "",
  moduleDependencies: {[uuidv4()]: ""},
  extendedFacades: {[uuidv4()]: ""},
  dataEvents: {[uuidv4()]: ""},
  executeSql: {[uuidv4()]: ""},
  serviceToEnable: "",
  serviceDescription: "",
  docPath: "",
  globalVariables: new Array<Variable>(),
  serviceVariables: new Array<Variable>(),
  loaded: false,
};

const defaultWiki: Wiki = {
  summary: "",
  specificationLink: "",
  direction: "", 
};

export const Config = atom({
  key: "configList",
  default: defaultConfig,
});

export const Module = atom({
  key: "moduleInfo",
  default: defaultModuleInfo,
});

export const WikiInfo = atom({
  key: "wikiInfo",
  default: defaultWiki,
});
