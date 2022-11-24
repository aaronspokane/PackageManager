import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { Config, Module, WikiInfo } from "../state/Atoms";
import Grid from '@mui/material/Grid';
import XMLViewer from "react-xml-viewer";
import beautify from "xml-beautifier";
import { Button, TextField } from "@mui/material";
import format from "xml-formatter";
import ModalDialog from "../components/ModalDialog";

const Wiki = () => {  

  const [open, setOpen] = useState(false);  
  const [wikiInfo, setWikiInfo] = useRecoilState(WikiInfo);

  const handleDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWikiInfo((oldWikiInfo) => {
      return {...oldWikiInfo, [e.target.name]: e.target.value}  
    });
  }  

  return (
    <React.Fragment>
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <TextField            
            id="summary"
            name="summary"
            label="Summary"
            fullWidth        
            multiline={true}  
            rows={2}  
            variant="standard"
            onChange={onChange}
            value={wikiInfo.summary}
          />
      </Grid>
      <Grid item xs={12}>
          <TextField            
            id="specificationLink"
            name="specificationLink"
            label="Specification Link"
            fullWidth 
            variant="standard"
            onChange={onChange}
            value={wikiInfo.specificationLink}
          />
      </Grid>
      <Grid item xs={12}>
          <TextField            
            id="direction"
            name="direction"
            label="Direction - Which way the data goes (FA->Client or Client->FA)"
            fullWidth 
            variant="standard"
            onChange={onChange}
            value={wikiInfo.direction}
          />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleDialog}>
            Generate Wiki
        </Button>
      </Grid>
      </Grid>
      <ModalDialog show={open} handleClick={handleDialog} />
    </React.Fragment>
  );
}

export default Wiki;