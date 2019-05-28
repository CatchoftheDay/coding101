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
        <div
          style={{
            display: "inline-block",
            border: `1px ${placeholder ? "dashed" : "solid"} black`,
            borderRadius: "20px",
            padding: "5px",
            flex: 1
          }}
        >
          {(step && step.condition) || NBSP}
        </div>
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
          {step && step.steps.map(step => <Step key={step.id} step={step} />)}
        </div>
      </div>
    </div>
  );
};

export default Condition;
