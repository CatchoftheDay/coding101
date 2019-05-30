import React from "react";
import { WhileStep } from "../types";
import Conditional from "./conditional";

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
        <Conditional
          conditionLabel="While"
          stepsLabel="Do"
          step={
            (step && {
              id: 0,
              type: "conditional",
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
