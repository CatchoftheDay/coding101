import React from "react";
import { NonConditionalStep, Step as StepModel } from "../types";
import Step from "./step";

const StepList = ({
  steps,
  parent
}: {
  parent?: StepModel;
  steps: ReadonlyArray<NonConditionalStep>;
}) => {
  if (steps.length) {
    return (
      <>
        {steps.map(step => (
          <Step key={step.id} step={step} parent={parent} />
        ))}
      </>
    );
  } else {
    return <Step parent={parent} />;
  }
};

export default StepList;
