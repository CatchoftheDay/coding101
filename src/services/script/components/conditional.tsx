import React from "react";
import { ConditionalStep, WhileStep } from "../types";
import Condition from "./condition";
import Step from "./step";

const Conditional = ({
  step,
  conditionLabel,
  stepsLabel
}: {
  step?: ConditionalStep | WhileStep;
  conditionLabel: string;
  stepsLabel: string;
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
        <Condition
          style={{ flex: 1 }}
          step={step}
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
          {step && step.steps.map(step => <Step key={step.id} step={step} />)}
        </div>
      </div>
    </div>
  );
};

export default Conditional;
