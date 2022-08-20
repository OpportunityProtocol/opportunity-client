import React, { useState, FC, ReactNode, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
} from "@mui/material";
import StepperComponent from "../Stepper";

interface IConfirmationDialogProps {
  open: boolean;
  onOpen?: () => void;
  onClose: () => void;
  primaryAction: () => void;
  primaryActionTitle: string;
  hasSigningStep?: boolean;
  content: Array<ReactNode>;
  loading?: boolean;
  success: boolean;
}

interface ISignConfirmationDialogProps {
  signAction?: () => void;
}

export const ConfirmationDialog: FC<
  IConfirmationDialogProps & ISignConfirmationDialogProps
> = ({
  content,
  open,
  onOpen = () => {},
  onClose,
  signAction,
  loading = false,
  hasSigningStep = false,
  primaryAction,
  success = false,
  primaryActionTitle,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = hasSigningStep
    ? ["Introduction", "Sign", "Execute"]
    : ["Introduction", "Execute"];

  useEffect(() => {
    if (open === true) {
      onOpen();
    }
  }, [open]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setActiveStep(0);
  };
  const getProgressButton = () => {
    switch (activeStep) {
      case 0:
        return (
          <Button onClick={() => setActiveStep((prevState) => prevState + 1)}>
            {" "}
            Next{" "}
          </Button>
        );
      case 1:
        return hasSigningStep ? (
          <Button
            onClick={() => {
              signAction();
              setActiveStep((prevState) => prevState + 1); //How to listen for metamask sign?
            }}
          >
            Sign Transaction
          </Button>
        ) : (
          <Button
            disabled={loading}
            variant="contained"
            onClick={
              success
                ? () => onClose()
                : () => {
                    primaryAction();
                  }
            }
          >
            {success ? "Close" : primaryActionTitle}
          </Button>
        );
      case 2:
        return (
          <Button
            disabled={loading}
            variant="contained"
            onClick={
              success
                ? () => onClose()
                : () => {
                    primaryAction();
                  }
            }
          >
            {success ? "Close" : primaryActionTitle}
          </Button>
        );
      default:
    }
  };

  const getBackButton = () => {
    switch (activeStep) {
      case 0:
        return <Button onClick={handleClose}>Cancel</Button>;
      case 1:
        return (
          <Button onClick={() => setActiveStep((prevState) => prevState - 1)}>
            Back
          </Button>
        );
      case 2:
        return (
          <Button onClick={() => setActiveStep((prevState) => prevState - 1)}>
            Back
          </Button>
        );
      default:
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ bgcolor: "#f8f8f8" }}>
        <StepperComponent steps={steps} activeStep={activeStep} />
      </DialogTitle>
      <Divider />
      {loading ? <LinearProgress variant="indeterminate" /> : null}
      {success ? (
        <DialogContent>Your transaction was successful!</DialogContent>
      ) : (
        <DialogContent>
          {content && content.length > 0 ? content[activeStep] : null}
        </DialogContent>
      )}

      <DialogActions>
        {getBackButton()}
        {getProgressButton()}
      </DialogActions>
    </Dialog>
  );
};
