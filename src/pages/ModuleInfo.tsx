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
import { stringify } from "querystring";

const ModuleInfo = () => {
  const configInfo = useRecoilValue(Config);
  const [moduleInfo, setmoduleInfo] = useRecoilState(Module);
  let xmlDoc = useRef<Document | null>(null);

  useEffect(() => {
    if(!moduleInfo.loaded) {
      let parser = new DOMParser();
      xmlDoc.current = parser.parseFromString(
        configInfo.packageConfig,
        "text/xml"
      );
      PopulateFields();
    }

    return () => {};
  }, []);

  const PopulateFields = () => {
    const moduleName =
      xmlDoc.current!.getElementsByTagName("Package")[0].getAttribute("name") ?? "";
    const moduleDescription =
      xmlDoc.current!.getElementsByTagName("Package")[0].getAttribute("description") ?? "";
    const docPath =
      xmlDoc.current!.getElementsByTagName("DocsPath")[0].textContent?.replace("..", "MAXQueue\\Server") ?? "";            
    const serviceToEnable = 
      xmlDoc.current!.querySelector('Service Description')?.textContent ?? "";  
    const globalList = 
      xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]');
    const serviceList = 
      xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])');
    const dataEvents = 
      xmlDoc.current!.querySelectorAll("DataEventTable");
    
    let _globalVariables = [...moduleInfo.globalVariables];
    globalList.forEach(node => {
      _globalVariables.push({
        Name: node.getAttribute("Name") ?? "",
        Value: node.getAttribute("Value") ?? "",
        VariableDescription: node.getAttribute("VariableDescription") ?? ""
      });
    });

    let _serviceVariables = [...moduleInfo.serviceVariables];
    serviceList.forEach(node => {
      _serviceVariables.push({
        Name: node.getAttribute("Name") ?? "",
        Value: node.getAttribute("Value") ?? "",
        VariableDescription: node.getAttribute("VariableDescription") ?? ""
      });
    });

    let _dataEvents: Record<string,string> = {};
    if (!!dataEvents.length) {
      dataEvents.forEach((node) => {
        const name = node.querySelector("Name")?.textContent ?? "";
        const action = node.querySelector("Action")?.textContent ?? "";
        Object.assign(_dataEvents, { [uuidv4()]: `${name} - ${action}` });
      });

      if(!Object.values(_dataEvents).includes(""))
        Object.assign(_dataEvents, {[uuidv4()]: ""});

      Object.assign(dataEvents, moduleInfo.dataEvents );
    }
    else 
    {
      _dataEvents = {...moduleInfo.dataEvents};
    }

    setmoduleInfo((oldData) => {
      return {
        ...oldData,
        moduleName: moduleName,
        moduleDescription: moduleDescription,        
        docPath: docPath,
        serviceToEnable: serviceToEnable,
        globalVariables: _globalVariables,
        serviceVariables: _serviceVariables, 
        dataEvents: _dataEvents,
        loaded: true,
      };
    });
  };  

  const createFiles = async (e: React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
    API.post(`/createFiles`, {...moduleInfo, ...configInfo})
    .then((result) => {
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

  const onListChange = useCallback ((e: React.ChangeEvent<HTMLInputElement>, key: string, type: string) => {
    e.preventDefault();   
        
    let _moduleInfo;  
    switch (type) {
      case "facade":
        _moduleInfo = { ...moduleInfo.extendedFacades };
        break;
      case "moduleDependency":
        _moduleInfo = { ...moduleInfo.moduleDependencies };
        break;       
      case "dataEvent":
        _moduleInfo = { ...moduleInfo.dataEvents };
        break;
      case "sql":
        _moduleInfo = { ...moduleInfo.executeSql };
        break;
    }
    _moduleInfo[key] = e.target.value;

    if(!Object.values(_moduleInfo).includes(""))
      Object.assign(_moduleInfo, {[uuidv4()]: ""});    

    setmoduleInfo((oldModuleInfo) => {
      return { ...oldModuleInfo, [e.target.name]: _moduleInfo };
    });
    
  }, [moduleInfo]);

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
            label="Folder Path (Where to create folders and files)"
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
                  name="moduleDependencies"
                  label="Module Dependencies"
                  value={value}
                  fullWidth                  
                  onChange={onListChange}
                  variant="standard"
                  index={key}
                  type="moduleDependency"
                />
              </Grid>
            );
          })
        }       
        {
          Object.entries(moduleInfo.extendedFacades).map(([key, value], index) => {
            return (
              <Grid item xs={12} key={key}>
                <CustomTextBox                  
                  name="extendedFacades"
                  label="Extended Facades"
                  value={value}
                  fullWidth                  
                  onChange={onListChange}
                  variant="standard"
                  index={key}
                  type="facade"
                />
              </Grid>
            );
          })
        }  
        {
          Object.entries(moduleInfo.dataEvents).map(([key, value], index) => {
            return (
              <Grid item xs={12} key={key}>
                <CustomTextBox                  
                  name="dataEvents"
                  label="Date Events to Enable"
                  value={value}
                  fullWidth                  
                  onChange={onListChange}
                  variant="standard"
                  index={key}
                  type="dataEvent"
                />
              </Grid>
            );
          })
        }       
        {
          Object.entries(moduleInfo.executeSql).map(([key, value], index) => {
            return (
              <Grid item xs={12} key={key}>
                <CustomTextBox                  
                  name="executeSql"
                  label="Sql to Execute"
                  value={value}
                  fullWidth                  
                  onChange={onListChange}
                  variant="standard"
                  index={key}
                  type="sql"
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

export default ModuleInfo;
