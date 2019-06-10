import React from "react";
import { ActionStep, Step as StepModel } from "../types";

const NBSP = "\u00A0";

const Action = ({
  step,
  activeStep,
  placeholder,
  onDelete
}: {
  step?: ActionStep;
  activeStep?: StepModel;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
}) => (
  <div
    style={{
      border: `${step === activeStep ? 3 : 1}px ${
        placeholder ? "dashed" : "solid"
      } #f99`,
      padding: step === activeStep ? "3px 8px" : "5px 10px",
      borderRadius: "5px",
      display: "flex"
    }}
  >
    <span style={{ flex: 1 }}>{(step && step.action) || NBSP}</span>
    {step && onDelete && <span onClick={() => onDelete(step)}> x</span>}
  </div>
);

export default Action;
