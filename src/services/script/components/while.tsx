import React from "react";
import { Step as StepModel, WhileStep } from "../types";
import Conditional from "./conditional";

const While = ({
  step,
  activeStep,
  placeholder,
  onDelete
}: {
  step: WhileStep;
  activeStep?: StepModel;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
}) => {
  return (
    <div
      style={{
        border: `1px ${placeholder ? "dashed" : "solid"} #9f9`,
        padding: "5px",
        borderRadius: "5px",
        display: "flex"
      }}
    >
      <Conditional
        style={{ flex: 1 }}
        conditionLabel="While"
        stepsLabel="Do"
        step={step}
        activeStep={activeStep}
        onDelete={onDelete}
      />
      {onDelete && (
        <span style={{ flex: 0 }} onClick={() => onDelete(step)}>
          {" "}
          x
        </span>
      )}
    </div>
  );
};

export default While;
