import React from "react";
import { OnInsert, Script, Step as StepModel, WhileStep } from "../types";
import Conditional from "./conditional";
import { buildSurround } from "../util";

const While = ({
  step,
  script,
  activeStep,
  onDelete,
  onInsert,
  paletteItem
}: {
  step: WhileStep;
  script?: Script;
  activeStep?: StepModel;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  paletteItem?: boolean;
}) =>
  buildSurround(
    {
      onDelete: onDelete && step && (() => onDelete(step)),
      style: {
        borderColor: "rgb(119, 177, 66)"
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
        activeStep={activeStep}
        onDelete={onDelete}
        onInsert={onInsert}
      />
    )
  );

export default While;
