import React from "react";
import { BranchStep } from "../types";
import Conditional from "./conditional";

const Branch = ({
  step,
  placeholder
}: {
  step: BranchStep;
  placeholder?: boolean;
}) => {
  return (
    <div
      style={{
        border: `1px ${placeholder ? "dashed" : "solid"} #99f`,
        padding: "5px",
        borderRadius: "5px"
      }}
    >
      {step.conditions.map((condition, idx) => (
        <Conditional
          key={condition.id}
          conditionLabel={idx == 0 ? "If" : "Else if"}
          stepsLabel="Then"
          step={condition}
        />
      ))}
    </div>
  );
};

export default Branch;
