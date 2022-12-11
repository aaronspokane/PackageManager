import React, { useRef } from "react";
import { Grid, TextField }  from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import { Config, Module } from "../state/Atoms";
import { defaultModuleInfo } from "../state/Atoms";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ConfigLoader() {
  let fileReader: FileReader;
  const inputId = useRef("");
  const [fileData, setFileData] = useRecoilState(Config);
  const [, setmoduleInfo] = useRecoilState(Module);

  const handleFileRead = (e: any) => {
    setFileData((oldConfig) => {
      return { ...oldConfig, [inputId.current]: e.target.result as string };
    });

    setmoduleInfo(() => {
      return defaultModuleInfo;
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    inputId.current = e.target.id;
    setFileData((oldConfig) => {
      return { ...oldConfig, [e.target.name]: e.target.files![0].name };
    });
    fileReader.readAsText(e.target.files[0]);
  };

  const filePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFileData((oldConfig) => {
      return { ...oldConfig, [e.target.name]: e.target.value}     
    });        
  }

  const handleXmPathClick = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    let _packageConfigFilePath = fileData.packageConfigFilePath;
    if (fileData.packageConfigFilePath?.length > 0 && fileData.packageConfigName?.length > 0) {
      if (e.target.checked) {
        let lastChar = "";

        if (fileData.packageConfigFilePath.slice(-1) !== "\\") {
          lastChar = "\\";
        }

        if (!_packageConfigFilePath.includes(fileData.packageConfigName))
          _packageConfigFilePath += `${lastChar}${fileData.packageConfigName}`;

      } else {
        if (_packageConfigFilePath.includes(fileData.packageConfigName))
          _packageConfigFilePath = _packageConfigFilePath.replace(fileData.packageConfigName, "");
      }

      setFileData((oldConfig) => {
        return { ...oldConfig, packageConfigFilePath: _packageConfigFilePath };
      });
    }    
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Package Xml File
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            name="packageConfigName"
            id="packageConfig"
            onChange={handleFileInput}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" fontSize={15} gutterBottom color="grey">
            Package Xml File: {fileData.packageConfigName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="saveCard" value="yes" onChange={handleXmPathClick} />}
            label="Use Package XML file name in Xml file path"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="packageConfigFilePath"
            label="Package Xml file Path"
            fullWidth            
            variant="standard"   
            value={fileData.packageConfigFilePath}         
            onChange={filePathChange}          
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
