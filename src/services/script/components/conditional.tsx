import React, { CSSProperties } from "react";
import { ConditionalStep, Step as StepModel, WhileStep } from "../types";
import Condition from "./condition";
import StepList from "./stepList";

const Conditional = ({
  step,
  activeStep,
  conditionLabel,
  stepsLabel,
  style,
  onDelete
}: {
  step?: ConditionalStep | WhileStep;
  activeStep?: StepModel;
  conditionLabel: string;
  stepsLabel: string;
  onDelete?: (step: StepModel) => void;
  style?: CSSProperties;
}) => {
  return (
    <div style={style}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "5px"
        }}
      >
        <div style={{ display: "inline-block", width: "5em" }}>
          {conditionLabel}
        </div>
        <Condition
          style={{ flex: 1 }}
          step={step}
          activeStep={activeStep}
          condition={(step && step.condition) || undefined}
        />
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "5px"
        }}
      >
        <div style={{ display: "inline-block", width: "5em" }}>
          {stepsLabel}
        </div>
        <div style={{ display: "inline-block", flex: 1 }}>
          {step && (
            <StepList
              steps={step.steps}
              activeStep={activeStep}
              parent={step}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conditional;
