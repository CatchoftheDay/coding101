import React from "react";
import { BranchStep, OnInsert, Script, Step as StepModel } from "../types";
import Conditional from "./conditional";

const Branch = ({
  step,
  script,
  activeStep,
  placeholder,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: BranchStep;
  script?: Script;
  activeStep?: StepModel;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) => (
  <div
    style={{
      border: `1px ${placeholder ? "dashed" : "solid"} #99f`,
      padding: "5px 10px",
      borderRadius: "5px",
      display: "flex"
    }}
  >
    {paletteItem ? (
      "If ... then ..."
    ) : (
      <div style={{ flex: 1 }}>
        {step.conditions.map((condition, idx) => (
          <Conditional
            style={{ flex: 1 }}
            key={condition.id}
            conditionLabel={idx == 0 ? "If" : "Else if"}
            stepsLabel="Then"
            step={condition}
            script={script}
            activeStep={activeStep}
            onDelete={onDelete}
            onInsert={onInsert}
          />
        ))}
      </div>
    )}
    {onDelete && <span onClick={() => onDelete(step)}> x</span>}
  </div>
);

export default Branch;
