import React from "react";
import { NonConditionalStep } from "../types";
import Step from "./step";

const StepContainer = ({
  steps
}: {
  steps: ReadonlyArray<NonConditionalStep>;
}) => (
  <div>
    {steps.map(step => (
      <Step key={step.id} step={step} />
    ))}
  </div>
);

export default StepContainer;
