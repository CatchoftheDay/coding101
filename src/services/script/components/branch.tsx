import React from "react";
import { BranchStep, OnInsert, Script, Step as StepModel } from "../types";
import Conditional from "./conditional";
import { buildSurround } from "../util";

const Branch = ({
  step,
  script,
  crashed,
  activeStep,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: BranchStep;
  script?: Script;
  crashed?: boolean;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) =>
  buildSurround(
    {
      style: {
        borderColor: "#77b142",
        backgroundColor: "#fcfffa"
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
            crashed={crashed}
            activeStep={activeStep}
            onDelete={onDelete}
            onInsert={onInsert}
            showDelete
          />
        ))}
      </div>
    )
  );

export default Branch;
