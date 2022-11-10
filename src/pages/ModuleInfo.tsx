import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, Module } from "../state/Atoms";
import { Button } from "@mui/material";
import { Variable } from "../models/ModuleInfo";
import API from '../api/Api';

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
      xmlDoc.current!.getElementsByTagName("DocsPath")[0].textContent ?? "";
    const serviceToEnable = xmlDoc.current!.querySelector('Service Description')?.textContent ?? "";    
    
    const globalList = xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]');
    const serviceList = xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])');
    
    let globalVariables = Array<Variable>();
    globalList.forEach(node => {
      globalVariables.push({
        Name: node.getAttribute("Name") ?? "",
        Value: node.getAttribute("Value") ?? "",
        VariableDescription: node.getAttribute("VariableDescription") ?? ""
      });
    });

    let serviceVariables = Array<Variable>();
    serviceList.forEach(node => {
      globalVariables.push({
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
        globalVariables: globalVariables,
        serviceVariables: serviceVariables
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
    setmoduleInfo((oldConfig) => {
      return { ...oldConfig, [e.target.name]: e.target.value };
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            id="moduleName"
            label="Folder Name"
            fullWidth
            value={moduleInfo.moduleName}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
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
          <TextField
            required
            id="Description"
            label="Description"
            fullWidth
            value={moduleInfo.moduleDescription}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="Description"
            label="Doc path"
            fullWidth
            value={moduleInfo.docPath}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="moduleDependencies"
            label="Module Dependencies"
            fullWidth
            value={moduleInfo.moduleDependencies}
            onChange={inputOnChange}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="serviceToEnable"
            label="Services to enable"
            fullWidth
            value={moduleInfo.serviceToEnable}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={createFiles}>Create Files</Button>
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
