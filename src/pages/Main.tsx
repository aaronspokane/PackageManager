import React, { Suspense, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRecoilValue } from "recoil";
import { Config } from "../state/Atoms";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Steps } from '../const/Constants';
import { Instantiate } from '../api/Api';
import config from '../config/config.json';
const ConfigLoader = React.lazy(() => import("./ConfigLoader"));
const ModuleInfo = React.lazy(() => import("./ModuleInfo"));
const Jira = React.lazy(() => import("./Jira"));
const Review = React.lazy(() => import("./Wiki"));

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
        Package Manager {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((
  props,
  ref,
) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getStepContent = (step: number, setErrorMsg: (error: string) => void, setOpen: (open: boolean) => void) => {
  switch (step) {
    case 0:
      return <ConfigLoader />;
    case 1:
      return <ModuleInfo error={setErrorMsg} showDialog={setOpen} />;
    case 2:
      return <Review />;
    case 3:
        return <Jira />;
    default:
      throw new Error("Unknown step");
  }
}

const Main = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const pkgConfig = useRecoilValue(Config);

  useEffect(() => {
    SetApi();
  },[]);

  const SetApi = () => {
    Instantiate(`${config.Api.url}`, config.Api.port)
  } 

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(activeStep === 0 && (!pkgConfig || pkgConfig.packageConfig.length <= 0 || pkgConfig.packageConfigFilePath.length <= 0)) {
      setErrorMsg("Package Xml File or Package Xml file Path not populated");
      setOpen(true);
      return;
    }
      
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Package Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Package Wizard
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {Steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === Steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Done with Package Manager.
              </Typography>              
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Suspense fallback={<div>Loading...</div>}>
                {getStepContent(activeStep, setErrorMsg, setOpen)}
              </Suspense>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                { 
                  activeStep === Steps.length - 1 ? null :
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Next
                  </Button>
                }
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
      </Snackbar>
      </Container>
    </>
  );
}

export default Main;
