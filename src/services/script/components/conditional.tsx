import React, { CSSProperties } from "react";
import {
  ConditionalStep,
  OnInsert,
  Script,
  Step as StepModel,
  WhileStep
} from "../types";
import Condition from "./condition";
import StepList from "./stepList";
import DeleteButton from "./deleteButton";

const Conditional = ({
  step,
  script,
  crashed,
  activeStep,
  conditionLabel,
  stepsLabel,
  style,
  onDelete,
  showDelete,
  onInsert
}: {
  step?: ConditionalStep | WhileStep;
  script?: Script;
  crashed?: boolean;
  activeStep?: StepModel;
  conditionLabel: string;
  stepsLabel: string;
  showDelete?: boolean;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  style?: CSSProperties;
}) => {
  return (
    <div style={{ display: "flex", ...style }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "inline-block", width: "5em" }}>
            {conditionLabel}
          </div>
          <Condition
            style={{ flex: 1 }}
            step={step}
            activeStep={activeStep}
            condition={(step && step.condition) || undefined}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{ display: "inline-block", width: "5em", marginTop: "11px" }}
          >
            {stepsLabel}
          </div>
          <div style={{ display: "inline-block", flex: 1 }}>
            {step && (
              <StepList
                steps={step.steps}
                script={script}
                crashed={crashed}
                activeStep={activeStep}
                parent={step}
                onDelete={onDelete}
                onInsert={onInsert}
              />
            )}
          </div>
        </div>
      </div>
      {step && onDelete && showDelete && (
        <DeleteButton onClick={() => onDelete(step)} />
      )}
    </div>
  );
};

export default Conditional;
