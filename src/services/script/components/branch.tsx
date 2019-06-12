import React from "react";
import { BranchStep, OnInsert, Script, Step as StepModel } from "../types";
import Conditional from "./conditional";
import { buildSurround } from "../util";

const Branch = ({
  step,
  script,
  activeStep,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: BranchStep;
  script?: Script;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) =>
  buildSurround(
    {
      onDelete: onDelete && (() => onDelete(step)),
      style: {
        borderColor: "rgb(119, 177, 66)"
      }
    },
    paletteItem ? (
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
    )
  );

export default Branch;
