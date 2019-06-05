import React from "react";
import { ActionStep, Step as StepModel } from "../types";

const NBSP = "\u00A0";

const Action = ({
  step,
  placeholder,
  onDelete
}: {
  step?: ActionStep;
  placeholder?: boolean;
  onDelete?: (step: StepModel) => void;
}) => (
  <div
    style={{
      border: `1px ${placeholder ? "dashed" : "solid"} #f99`,
      padding: "5px",
      borderRadius: "5px",
      display: "flex"
    }}
  >
    <span style={{ flex: 1, padding: "5px" }}>
      {(step && step.action) || NBSP}
    </span>
    {step && onDelete && <span onClick={() => onDelete(step)}> x</span>}
  </div>
);

export default Action;
