import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { Config, Module, WikiInfo } from "../state/Atoms";
import Grid from '@mui/material/Grid';
import beautify from "xml-beautifier";
import { Button, TextField } from "@mui/material";
import format from "xml-formatter";
import ModalDialog from "../components/ModalDialog";
import CustomTextBox from '../components/CustomTextBox';
import { ValidatorForm } from "react-material-ui-form-validator";

const Wiki = () => {  

  const [open, setOpen] = useState(false);  
  const [wikiInfo, setWikiInfo] = useRecoilState(WikiInfo);
  let validationForm: ValidatorForm = React.createRef();

  const handleDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    validationForm.current.isFormValid(false).then(async (isValid) => {
      if (isValid) {
        setOpen(!open);
      } else {
        console.log("ERROR!!!");
      }
    });
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    e.preventDefault();
    setWikiInfo((oldWikiInfo) => {
      return {...oldWikiInfo, [e.target.name]: e.target.value}  
    });
  }  

  return (
    <React.Fragment>
       <ValidatorForm   
          onSubmit={() => {return false}}
          ref={validationForm}           
          debounceTime={100}
      >
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <CustomTextBox            
            id="summary"
            name="summary"
            label="Summary"
            fullWidth        
            multiline={true}  
            rows={2}  
            variant="standard"
            onChange={onChange}
            validators={['required']}
            value={wikiInfo.summary}
          />
      </Grid>
      <Grid item xs={12}>
          <CustomTextBox            
            id="specificationLink"
            name="specificationLink"
            label="Specification Link (Jira)"
            fullWidth 
            variant="standard"
            onChange={onChange}
            validators={['required']}
            value={wikiInfo.specificationLink}
          />
      </Grid>
      <Grid item xs={12}>
          <CustomTextBox            
            id="direction"
            name="direction"
            label="Direction - Which way the data goes (FA->Client or Client->FA)"
            fullWidth 
            variant="standard"
            onChange={onChange}
            validators={['required']}
            value={wikiInfo.direction}
          />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleDialog} type="submit">
            Generate Wiki
        </Button>
      </Grid>
      </Grid>
      <ModalDialog show={open} handleClick={handleDialog} type="Wiki" />
      </ValidatorForm>
    </React.Fragment>
  );
}

export default Wiki;