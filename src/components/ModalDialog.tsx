import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, TextField, Grid } from '@mui/material';
import Typography from "@mui/material/Typography";
import { useRecoilValue } from "recoil";
import { Config } from "../state/Atoms";
import format from "xml-formatter";
import {CopyToClipboard} from 'react-copy-to-clipboard';
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
    const [xml, setXml] = useState<string>();

    useEffect(() => {      
        let parser = new DOMParser();
        xmlDoc.current = parser.parseFromString(
          pkgConfig.packageConfig,
          "text/xml"
        );

        GenerateWikiFields();             
    }, []);

    const GenerateWikiFields = () => {
      const dataEvents = xmlDoc.current!.querySelectorAll("DataEventTable");

      if (!!dataEvents.length) {
        let _dataEvents = Array<string>();

        dataEvents.forEach(node => {            
            var formattedXml = format(node.outerHTML, {
                indentation: "  ",
                collapseContent: true,
                lineSeparator: "\n",
            });

            _dataEvents.push(formattedXml);
        });       

        if(_dataEvents.length > 0)
            setXml(_dataEvents.join('\n'));
      }
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
              <pre>{xml}</pre>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CopyToClipboard text={xml} onCopy={() => null}>
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