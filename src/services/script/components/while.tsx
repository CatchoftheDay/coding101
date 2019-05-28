import React from "react";
import { WhileStep } from "../types";
import Condition from "./condition";

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
        border: `1px ${placeholder ? "dashed" : "solid"} #9f9`,
        padding: "5px",
        borderRadius: "5px"
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
              steps: step.steps
            }) ||
            undefined
          }
        />
      </div>
    </div>
  );
};

export default While;
