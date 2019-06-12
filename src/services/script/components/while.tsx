import React from "react";
import { OnInsert, Script, Step as StepModel, WhileStep } from "../types";
import Conditional from "./conditional";

const While = ({
  step,
  script,
  activeStep,
  placeholder,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: WhileStep;
  script?: Script;
  activeStep?: StepModel;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) => (
  <div
    style={{
      border: `1px ${placeholder ? "dashed" : "solid"} #9f9`,
      padding: "5px 10px",
      borderRadius: "5px",
      display: "flex"
    }}
  >
    {paletteItem ? (
      "While ... do ..."
    ) : (
      <Conditional
        style={{ flex: 1 }}
        conditionLabel="While"
        stepsLabel="Do"
        step={step}
        script={script}
        activeStep={activeStep}
        onDelete={onDelete}
        onInsert={onInsert}
      />
    )}
    {onDelete && (
      <span style={{ flex: 0 }} onClick={() => onDelete(step)}>
        {" "}
        x
      </span>
    )}
  </div>
);

export default While;
