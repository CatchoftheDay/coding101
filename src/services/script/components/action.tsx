import React, { ReactElement } from "react";
import { ActionStep, Step as StepModel } from "../types";
import { buildSurround } from "../util";
import { actions } from "../../../constants";

const NBSP = "\u00A0";

const Action = ({
  step,
  activeStep,
  placeholder,
  onDelete,
  crashed
}: {
  step?: ActionStep;
  activeStep?: StepModel;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
  crashed?: boolean;
}) =>
  buildSurround(
    {
      onDelete: onDelete && step && (() => onDelete(step)),
      highlight: step && step === activeStep,
      placeholder: placeholder,
      style:
        step && step === activeStep && crashed
          ? { borderColor: "#de5151", backgroundColor: "#ffd9d9" }
          : { borderColor: "#1c5a87", backgroundColor: "#ebf1f7" }
    },
    <span style={{ flex: 1 }}>
      {step && step.action ? getLabel(step.action) : NBSP}
    </span>
  );

const getLabel = (actionId: string) =>
  actions.reduce(
    (label: ReactElement | string | undefined, action) =>
      action.id === actionId ? action.label : label,
    undefined
  );

export default Action;
