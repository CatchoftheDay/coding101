import React from "react";
import { ConditionStep } from "../types";
import Step from "./step";

const NBSP = "\u00A0";

const Condition = ({
  step,
  conditionLabel,
  stepsLabel,
  placeholder
}: {
  step?: ConditionStep;
  conditionLabel: string;
  stepsLabel: string;
  placeholder?: boolean;
}) => {
  return (
    <div>
      <div>
        <span>{conditionLabel}</span>
        <span
          style={{
            border: `2px ${placeholder ? "dashed" : "solid"} black`,
            borderRadius: "20px",
            padding: "5px"
          }}
        >
          {(step && step.condition) || NBSP}
        </span>
      </div>
      <div>
        <span>{stepsLabel}</span>
        <div>
          {step && step.steps.map(step => <Step key={step.id} step={step} />)}
        </div>
      </div>
    </div>
  );
};

export default Condition;
