import React from "react";
import { OnInsert, Script, Step as StepModel, WhileStep } from "../types";
import Conditional from "./conditional";
import { buildSurround } from "../util";

const While = ({
  step,
  script,
  crashed,
  activeStep,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: WhileStep;
  script?: Script;
  crashed?: boolean;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) =>
  buildSurround(
    {
      onDelete: onDelete && step && (() => onDelete(step)),
      style: {
        borderColor: "#77b142",
        backgroundColor: "#fcfffa"
      }
    },
    paletteItem ? (
      "While ... do ..."
    ) : (
      <Conditional
        style={{ flex: 1 }}
        conditionLabel="While"
        stepsLabel="Do"
        step={step}
        script={script}
        crashed={crashed}
        activeStep={activeStep}
        onDelete={onDelete}
        onInsert={onInsert}
      />
    )
  );

export default While;
