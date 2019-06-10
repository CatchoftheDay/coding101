import React, { CSSProperties } from "react";
import { NonConditionalStep, Step as StepModel } from "../types";
import Step from "./step";

const StepList = ({
  steps,
  parent,
  activeStep,
  onDelete,
  style
}: {
  parent?: StepModel;
  steps: ReadonlyArray<NonConditionalStep>;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  style?: CSSProperties;
}) => {
  if (steps.length) {
    return (
      <div style={style}>
        {steps.map(step => (
          <Step
            key={step.id}
            step={step}
            activeStep={activeStep}
            parent={parent}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  } else {
    return <Step style={style} parent={parent} />;
  }
};

export default StepList;
