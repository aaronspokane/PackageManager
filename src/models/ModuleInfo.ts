export type ModuleInfo = {
  moduleName: string;
  moduleDescription: string;
  modulePath: string;
  moduleDependencies: string;
  serviceToEnable: string;
  serviceDescription: string;
  docPath: string;
  globalVariables: Array<Variable>;
  serviceVariables: Array<Variable>
};

export type Variable = {
    Name: string;
    Value: string;
    VariableDescription: string;
}