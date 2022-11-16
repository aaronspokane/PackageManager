export type ModuleInfo = {
  moduleName: string;
  moduleDescription: string;
  modulePath: string;
  moduleDependencies: Record<string, string>;
  extendedFacades: Record<string, string>;
  serviceToEnable: string;
  serviceDescription: string;
  docPath: string;
  globalVariables: Array<Variable>;
  serviceVariables: Array<Variable>;
  loaded: boolean;
};

export type Variable = {
    Name: string;
    Value: string;
    VariableDescription: string;
}