export type ModuleInfo = {
  moduleName: string;
  moduleDescription: string;
  modulePath: string;
  moduleDependencies: string;
  serviceToEnable: string;
  serviceDescription: string;
  docPath: string;
  globalVariables: Array<string>;
  serviceVariables: Array<string>
};
