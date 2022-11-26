import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, TextField, Grid } from '@mui/material';
import Typography from "@mui/material/Typography";
import { useRecoilValue, useRecoilState } from "recoil";
import { Config, WikiInfo } from "../state/Atoms";
import format from "xml-formatter";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Constants from '../const/Constants';
import { wrap } from "module";
import { GenerateWikiData } from '../utility/Utility';
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
        const _data = GenerateWikiData(xmlDoc, wikiInfo);
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