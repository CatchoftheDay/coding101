import React, { ReactNode } from "react";

const NBSP = "\u00A0";

const Status = ({
  status,
  statusColor,
  variables
}: {
  status?: ReactNode;
  statusColor: string;
  variables: string[];
}) => (
  <div style={{ textAlign: "center" }}>
    {variables.map(varName => (
      <code key={varName} style={{ float: "right", paddingRight: "5px" }}>
        {varName}
      </code>
    ))}
    <strong key="0" style={{ color: statusColor }}>
      {status !== undefined ? status : NBSP}
    </strong>
  </div>
);

export default Status;
