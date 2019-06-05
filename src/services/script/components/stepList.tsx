import React from "react";
import { NonConditionalStep, Step as StepModel } from "../types";
import Step from "./step";

const StepList = ({
  steps,
  parent,
  onDelete
}: {
  parent?: StepModel;
  steps: ReadonlyArray<NonConditionalStep>;
  onDelete?: (step: StepModel) => void;
}) => {
  if (steps.length) {
    return (
      <>
        {steps.map(step => (
          <Step key={step.id} step={step} parent={parent} onDelete={onDelete} />
        ))}
      </>
    );
  } else {
    return <Step parent={parent} />;
  }
};

export default StepList;
