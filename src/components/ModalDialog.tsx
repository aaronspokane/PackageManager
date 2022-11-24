import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, TextField, Grid } from '@mui/material';
import Typography from "@mui/material/Typography";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, WikiInfo } from "../state/Atoms";
import format from "xml-formatter";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Constants from '../const/Constants';
import { wrap } from "module";

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const ModalDialog = ({show, handleClick}) => {
    let xmlDoc = useRef<Document | null>(null);
    const pkgConfig = useRecoilValue(Config); 
    const [wikiInfo,] = useRecoilState(WikiInfo);
    const [data, setData] = useState<string>();

    useEffect(() => {      
        let parser = new DOMParser();
        xmlDoc.current = parser.parseFromString(
          pkgConfig.packageConfig,
          "text/xml"
        );                   
    }, []);

    useEffect(() => {
        GenerateWikiFields();
    },[wikiInfo])

    const GenerateWikiFields = () => {
      const dataEvents = xmlDoc.current!.querySelectorAll("DataEventTable");

      let _dataEvents = Array<string>();
      let _data = "";

      const _summary = wikiInfo.summary ? wikiInfo.summary : Constants.DEFAULT_WIKI_TEXT;
      const _links = wikiInfo.specificationLink ? wikiInfo.specificationLink : Constants.DEFAULT_WIKI_TEXT;   
      const _direction = wikiInfo.direction ? wikiInfo.direction : Constants.DEFAULT_WIKI_TEXT;      

      _data = "{toc}\n\n";
      _data += "!nameOfImage.jpg!\n\n";
      _data += "h1. Summary\n";
      _data += `${_summary}\n\n`;
      _data += "h1. Specification Links\n";
      _data += `${_links}\n\n`;
      _data += "h1. Direction\n";
      _data += `${_direction}\n\n`;
      _data += "h1. WorkFlow\n";
      _data += `* Step by step play of what workflow does.\n\n`; 
      _data += `h1. Technical Details\n\n`; 
      _data += `h2. Variables\n`; 
      _data += `* List of vars and varx variables that need to be configured and what they relate to.\n\n`; 
      _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
      _data += `* Instance\n\n`; 
      const globalList = 
        Array.from(xmlDoc.current!.querySelectorAll('Variables Variable[VariableType="GLOBAL"]'));
      const serviceList = 
        Array.from(xmlDoc.current!.querySelectorAll('Variables Variable:not([VariableType="GLOBAL"])'));

      const gvMaxLength =  Math.max(...globalList.map(x => x.getAttribute("Name")!.length));            
      const svMaxLength =  Math.max(...serviceList.map(x => x.getAttribute("Name")!.length)); 
        
    if(globalList) {
      globalList.forEach((node) => {
         const length = node.getAttribute("Name")!.length;
        _data += node.getAttribute("Name") + ' '.repeat((gvMaxLength - length) + 3) + node.getAttribute("Value") + `\n`; 
      });
      _data += "{noformat}"; 
      _data += "\n\n"; 
    }

    _data += `{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n`; 
    _data += `* Service\n\n`; 

    if(serviceList) {
        serviceList.forEach((node) => {
           const length = node.getAttribute("Name")!.length;
          _data += node.getAttribute("Name") + ' '.repeat((svMaxLength - length) + 3) + node.getAttribute("Value") + `\n`; 
        });
        _data += "{noformat}"; 
        _data += "\n\n"; 
      }

      _data += "h2. Data Events\n"; 
      _data += "* List of Data Events used by the interface\n\n";  

      if (!!dataEvents.length) { 
        dataEvents.forEach(node => {            
            var formattedXml = format(node.outerHTML, {
                indentation: "  ",
                collapseContent: true,
                lineSeparator: "\n",
            });

            var tempData = "{noformat:nopanel=false|panel:borderStyle=solid|bgColor=lemonchiffon}\n";
            tempData += "Custom Data Event:\n";
            _dataEvents.push(tempData + formattedXml + "\n{noformat}\n");
        }); 

        if(_dataEvents.length > 0)
            _data += _dataEvents.join('\n');
      } 
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

export default ModalDialog;