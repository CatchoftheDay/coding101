import React from "react";
import { BranchStep } from "../types";
import Condition from "./condition";

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
        border: `2px ${placeholder ? "dashed" : "solid"} black`,
        borderRadius: "20px"
      }}
    >
      {step.conditions.map((condition, idx) => (
        <Condition
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
