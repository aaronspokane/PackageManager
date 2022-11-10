import React, { useRef } from "react";
import { Grid, TextField }  from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import { Config } from "../state/Atoms";

export default function ConfigLoader() {
  let fileReader: FileReader;
  const inputId = useRef("");
  const [fileData, setFileData] = useRecoilState(Config);

  const handleFileRead = (e: any) => {
    setFileData((oldConfig) => {
      return { ...oldConfig, [inputId.current]: e.target.result as string };
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

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Api File
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            name="apiConfigName"
            id="apiConfig"
            onChange={handleFileInput}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" fontSize={15} gutterBottom color="grey">
            Api File: {fileData.apiConfigName}
          </Typography>
        </Grid>
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
