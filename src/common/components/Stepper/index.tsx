import React, { FC } from 'react'

import {
    Stepper,
    Step,
    StepLabel,
    styled
} from '@mui/material'

import { StepIconProps } from "@mui/material/StepIcon";

import StepConnector, {
    stepConnectorClasses,
} from "@mui/material/StepConnector";

import Check from "@mui/icons-material/Check";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 5,
      borderRadius: 8,
    },
  }));
  
  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
      ...(ownerState.active && {
        color: theme.palette.primary.main,
      }),
      "& .QontoStepIcon-completedIcon": {
        color: theme.palette.primary.main,
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-circle": {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );
  
  function QontoStepIcon(props: StepIconProps): JSX.Element {
    const { active, completed, className } = props;
  
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  interface IStepperProps {
    steps: Array<string>;
    activeStep: number;
  }

  const StepperComponent: FC<IStepperProps> = ({ steps, activeStep }): JSX.Element => {
    return (
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> 
    )
  }

export { QontoStepIcon, QontoConnector, QontoStepIconRoot, type IStepperProps }
export default StepperComponent