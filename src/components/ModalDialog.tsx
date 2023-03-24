import React, { useEffect, useRef, useState, useMemo } from "react";
import { Modal, Button, TextField, Grid } from '@mui/material';
import Typography from "@mui/material/Typography";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, WikiInfo, JiraInfo } from "../state/Atoms";
import format from "xml-formatter";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Constants from '../const/Constants';
import { wrap } from "module";
import { GenerateWikiData, GenerateJiraData } from '../utility/Utility';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import config from '../config/config.json';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const ModalDialog = ({show, handleClick, type}) => {
    let xmlDoc = useRef<Document | null>(null);
    const pkgConfig = useRecoilValue(Config); 
    const [wikiInfo,] = useRecoilState(WikiInfo);
    const jiraInfo = useRecoilValue(JiraInfo); 
    const [data, setData] = useState<string>("");

    useEffect(() => {    
      if(type === "Wiki") {  
        let parser = new DOMParser();
        xmlDoc.current = parser.parseFromString(
          pkgConfig.packageConfig,
          "text/xml"
        );   
      }       
    }, []);

    useEffect(() => {
      if(type === "Wiki" && show)
          GenerateWikiFields();
    },[show]);

    useEffect(() => {
      if(type === "Jira" && show)
        GenerateJiraFields();
    },[show]);

    const GenerateWikiFields = async () => {
        const _data = await GenerateWikiData(xmlDoc, wikiInfo);
        setData(_data);
    };     

    const GenerateJiraFields = async () => {
        const _data = await GenerateJiraData(jiraInfo);
        setData(_data);
    };

    return (
      <>
        <BootstrapDialog
          aria-labelledby="customized-dialog-title"
          open={show}
          fullWidth
          maxWidth="md"
          scroll="paper"
        >
          <DialogContent>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Typography variant="inherit" fontSize={11} gutterBottom>
                <pre>
                    {data}
                </pre>
            </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CopyToClipboard text={data} onCopy={() => null}>
              <Button autoFocus variant="contained">
                Copy to Clipboard
              </Button>
            </CopyToClipboard>
            <Button onClick={handleClick} variant="contained">
              Close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </>
    );
};

export default React.memo(ModalDialog);