import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, Module } from "../state/Atoms";
import { Button } from "@mui/material";

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
    
    const globalList = xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]');
    const serviceList = xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])');

    setmoduleInfo((oldData) => {
      return {
        ...oldData,
        moduleName: moduleName,
        moduleDescription: moduleDescription,
      };
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            id="fldName"
            label="Folder Name"
            fullWidth
            value={moduleInfo.moduleName}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="filePath"
            label="Folder Path"
            fullWidth
            value={moduleInfo.modulePath}
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
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained">Create Files</Button>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
