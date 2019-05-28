import React from "react";
import { WhileStep } from "../types";
import Condition from "./condition";
import Step from "./step";

const While = ({
  step,
  placeholder
}: {
  step: WhileStep;
  placeholder?: boolean;
}) => {
  return (
    <div
      style={{
        border: `2px ${placeholder ? "dashed" : "solid"} black`,
        borderRadius: "20px"
      }}
    >
      <div>
        <Condition
          conditionLabel="While"
          stepsLabel="Do"
          step={
            (step && {
              id: 0,
              type: "condition",
              condition: step.condition,
              steps: []
            }) ||
            undefined
          }
        />
      </div>
      <div>
        {step.steps.map(childStep => (
          <Step key={childStep.id} step={childStep} />
        ))}
      </div>
    </div>
  );
};

export default While;
