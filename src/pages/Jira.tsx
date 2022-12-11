import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Grid from '@mui/material/Grid';
import { Button, TextField } from "@mui/material";
import ModalDialog from "../components/ModalDialog";
import CustomTextBox from '../components/CustomTextBox';
import { ValidatorForm } from "react-material-ui-form-validator";
import { JiraInfo } from "../state/Atoms";

const Jira = () => {
    const [open, setOpen] = useState(false);
    let validationForm: ValidatorForm = React.createRef();
    const [jiraInfo, setJiraInfo] = useRecoilState(JiraInfo);

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
        setJiraInfo((oldJiraInfo) => {
          return {...oldJiraInfo, [e.target.name]: e.target.value}  
        });
    }

    const handleGetCommits = () => {
        
    }

    return (
        <>
          <ValidatorForm   
            onSubmit={() => {return false}}
            ref={validationForm}           
            debounceTime={100}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox            
                        id="sha"
                        name="sha"
                        label="Revision Numbers (SHAs)"
                        fullWidth   
                        onChange={onChange}                        
                        value={jiraInfo.sha}                 
                        variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={handleGetCommits} type="submit">
                        Get Commits from Github
                    </Button>
                </Grid> 
                <Grid item xs={12}>
                    <CustomTextBox            
                        id="commits"
                        name="commits"
                        label="Commits"
                        multiline={true}
                        fullWidth
                        rows={8}  
                        onChange={onChange}
                        validators={['required']}
                        value={jiraInfo.commits}  
                        variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox            
                        id="testing"
                        name="testing"
                        label="Testing"
                        multiline={true}
                        fullWidth
                        rows={8}  
                        onChange={onChange}
                        validators={['required']}
                        value={jiraInfo.testing}  
                        variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox            
                        id="notes"
                        name="notes"
                        label="Notes"
                        multiline={true}
                        fullWidth
                        rows={2}  
                        value={jiraInfo.notes}  
                        onChange={onChange}
                        variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={handleDialog} type="submit">
                        Generate Jira Comments
                    </Button>
                </Grid>             
            </Grid>
            <ModalDialog show={open} handleClick={handleDialog} type="Jira" />
          </ValidatorForm>
        </>
    );
}

export default Jira;