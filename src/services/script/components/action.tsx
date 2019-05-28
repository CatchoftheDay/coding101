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
        border: `1px ${placeholder ? "dashed" : "solid"} #f99`,
        padding: "5px",
        borderRadius: "5px"
      }}
    >
      <span style={{ padding: "5px" }}>{(step && step.action) || NBSP}</span>
    </div>
  );
};

export default Action;
