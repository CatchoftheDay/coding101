import React from "react";
import { BranchStep, Step as StepModel } from "../types";
import Conditional from "./conditional";

const Branch = ({
  step,
  placeholder,
  onDelete
}: {
  step: BranchStep;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
}) => (
  <div
    style={{
      border: `1px ${placeholder ? "dashed" : "solid"} #99f`,
      padding: "5px",
      borderRadius: "5px",
      display: "flex"
    }}
  >
    <div style={{ flex: 1 }}>
      {step.conditions.map((condition, idx) => (
        <Conditional
          style={{ flex: 1 }}
          key={condition.id}
          conditionLabel={idx == 0 ? "If" : "Else if"}
          stepsLabel="Then"
          step={condition}
          onDelete={onDelete}
        />
      ))}
    </div>
    {onDelete && <span onClick={() => onDelete(step)}> x</span>}
  </div>
);

export default Branch;
