import * as React from "react";
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
import ConfigLoader from "./ConfigLoader";
import ModuleInfo from "./ModuleInfo";
import Jira from "./Jira";
import Review from "./Wiki";
import { useRecoilValue } from "recoil";
import { Config } from "../state/Atoms";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      Package Manager {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const steps = ["Config Loader", "Module Info", "Confluence Info", "Jira Info"];

function getStepContent(step: number, setErrorMsg: (error: string) => void, setOpen: (open: boolean) => void) {
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

export default function Main() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const pkgConfig = useRecoilValue(Config);

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
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, setErrorMsg, setOpen)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                { 
                  activeStep === steps.length - 1 ? null :
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
