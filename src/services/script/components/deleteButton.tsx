import React, { CSSProperties } from "react";

const DeleteButton = ({
  onClick,
  style
}: {
  onClick?: () => void;
  style?: CSSProperties;
}) => (
  <a
    style={{
      textDecoration: "none",
      paddingLeft: "0.5em",
      cursor: "pointer",
      ...style
    }}
    onClick={onClick}
  >
    x
  </a>
);

export default DeleteButton;
