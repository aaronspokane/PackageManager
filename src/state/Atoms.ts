import { atom } from "recoil";
import { Configs } from "../models/configs";
import { ModuleInfo, Variable } from "../models/ModuleInfo";
import { Wiki} from "../models/Wiki";
import { Jira} from "../models/Jira";
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

const defaultJira: Jira = {
  sha: "",
  testing: "",
  notes: "", 
  commits: "",
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

export const JiraInfo = atom({
  key: "jiraInfo",
  default: defaultJira,
});
