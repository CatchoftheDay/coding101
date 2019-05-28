import React from "react";
import { ActionStep } from "../types";

const NBSP = "\u00A0";

const Action = ({
  step,
  placeholder
}: {
  step?: ActionStep;
  placeholder?: boolean;
}) => {
  return (
    <div
      style={{
        border: `2px ${placeholder ? "dashed" : "solid"} red`,
        borderRadius: "20px"
      }}
    >
      <span style={{ padding: "5px" }}>{(step && step.action) || NBSP}</span>
    </div>
  );
};

export default Action;
