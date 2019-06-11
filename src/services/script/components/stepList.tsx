import React, { CSSProperties } from "react";
import {
  NonConditionalStep,
  OnInsert,
  Script,
  Step as StepModel
} from "../types";
import Step from "./step";

const StepList = ({
  steps,
  parent,
  script,
  activeStep,
  onDelete,
  onInsert,
  style
}: {
  parent?: StepModel;
  steps: ReadonlyArray<NonConditionalStep>;
  script?: Script;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  style?: CSSProperties;
}) => {
  if (steps.length) {
    return (
      <div style={style}>
        {steps.map(step => (
          <Step
            key={step.id}
            step={step}
            script={script}
            activeStep={activeStep}
            parent={parent}
            onDelete={onDelete}
            onInsert={onInsert}
          />
        ))}
      </div>
    );
  } else {
    return <Step style={style} parent={parent} />;
  }
};

export default StepList;
