import React, { CSSProperties, ReactElement, ReactNode } from "react";
import DeleteButton from "./components/deleteButton";

/** Builds the surround elements for a step */
export const buildSurround = (
  {
    onDelete,
    placeholder,
    highlight,
    style
  }: {
    highlight?: boolean;
    placeholder?: boolean;
    onDelete?: () => void;
    style?: CSSProperties;
  },
  children: ReactNode | ReadonlyArray<ReactNode>
) => {
  if (onDelete) {
    if (Array.isArray(children)) {
      children = children.slice();
    } else if (children == null) {
      children = [];
    } else {
      if (typeof children !== "object") {
        children = React.createElement("span", {}, children);
      }

      children = [{ ...(children as ReactElement), key: "childNode" }];
    }
    (children as ReactNode[]).push(
      React.createElement(DeleteButton, {
        key: "deleteNode",
        onClick: onDelete
      })
    );
  }

  return React.createElement(
    "div",
    {
      style: {
        borderWidth: `${highlight ? 3 : 1}px`,
        borderStyle: placeholder ? "dashed" : "solid",
        borderColor: "black",
        text: "black",
        background: "white",
        padding: highlight ? "3px 8px" : "5px 10px",
        margin: "5px 0",
        borderRadius: "5px",
        display: "flex",
        ...style
      }
    },
    children
  );
};
