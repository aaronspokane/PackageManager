import React, { useEffect, useRef, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, Module } from "../state/Atoms";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { Variable } from "../models/ModuleInfo";
import API from '../api/Api';
import CustomTextBox from '../components/CustomTextBox';

export default function ModuleInfo() {
  const configList = useRecoilValue(Config);
  const [moduleInfo, setmoduleInfo] = useRecoilState(Module);
  let xmlDoc = useRef<Document | null>(null);

  useEffect(() => {
    let parser = new DOMParser();
    xmlDoc.current = parser.parseFromString(
      configList.packageConfig,
      "text/xml"
    );
    PopulateFields();

    return () => {};
  }, []);

  const PopulateFields = () => {
    const moduleName =
      xmlDoc.current!.getElementsByTagName("Package")[0].getAttribute("name") ?? "";
    const moduleDescription =
      xmlDoc.current!.getElementsByTagName("Package")[0].getAttribute("description") ?? "";
    const docPath =
      xmlDoc.current!.getElementsByTagName("DocsPath")[0].textContent?.replace("..", "MAXQueue\\Server") ?? "";            
    const serviceToEnable = xmlDoc.current!.querySelector('Service Description')?.textContent ?? "";  
    const globalList = xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]');
    const serviceList = xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])');
    
    let _globalVariables = Array<Variable>();
    globalList.forEach(node => {
      _globalVariables.push({
        Name: node.getAttribute("Name") ?? "",
        Value: node.getAttribute("Value") ?? "",
        VariableDescription: node.getAttribute("VariableDescription") ?? ""
      });
    });

    let _serviceVariables = Array<Variable>();
    serviceList.forEach(node => {
      _serviceVariables.push({
        Name: node.getAttribute("Name") ?? "",
        Value: node.getAttribute("Value") ?? "",
        VariableDescription: node.getAttribute("VariableDescription") ?? ""
      });
    });

      setmoduleInfo((oldData) => {
      return {
        ...oldData,
        moduleName: moduleName,
        moduleDescription: moduleDescription,        
        docPath: docPath,
        serviceToEnable: serviceToEnable,
        globalVariables: _globalVariables,
        serviceVariables: _serviceVariables
      };
    });
  };  

  const createFiles = async (e: React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
    API.post(`/createFiles`, {...moduleInfo, ...configList})
    .then( (result) => {
        console.log(`Success... ${result}`);
        return result;
    })
    .catch(err => console.log("error"));
  }

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setmoduleInfo((oldModuleInfo) => {
      return { ...oldModuleInfo, [e.target.name]: e.target.value };
    });
  };  

  const inputOnDependecieChange = useCallback ((e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    e.preventDefault();
    
    let _moduleInfo = {...moduleInfo.moduleDependencies};  
    _moduleInfo[key] = e.target.value;

    if(!Object.values(_moduleInfo).includes(""))
      Object.assign(_moduleInfo, {[uuidv4()]: ""});    

    setmoduleInfo((oldModuleInfo) => {
      return { ...oldModuleInfo, [e.target.name]: _moduleInfo };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextBox
            required
            id="moduleName"
            name="moduleName"
            label="Folder Name"
            fullWidth
            value={moduleInfo.moduleName}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextBox
            required
            name="modulePath"
            label="Folder Path"
            fullWidth
            value={moduleInfo.modulePath}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextBox
            required
            id="moduleDescription"
            name="moduleDescription"
            label="Description"
            fullWidth
            value={moduleInfo.moduleDescription}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextBox
            required
            id="docPath"
            name="docPath"
            label="Doc path"
            fullWidth
            value={moduleInfo.docPath}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>        
        {
          Object.entries(moduleInfo.moduleDependencies).map(([key, value], index) => {
            return (
              <Grid item xs={12} key={key}>
                <CustomTextBox
                  required
                  name="moduleDependencies"
                  label="Module Dependencies"
                  value={value}
                  fullWidth                  
                  onChange={inputOnDependecieChange}
                  variant="standard"
                  index={key}
                />
              </Grid>
            );
          })
        }       
        <Grid item xs={12}>
          <CustomTextBox
            required
            id="serviceToEnable"
            name="serviceToEnable"
            label="Services to enable"
            fullWidth
            value={moduleInfo.serviceToEnable}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={createFiles}>
            Create Files
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="saveCard" value="yes" />}
            label="Did you commit files to Github"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
