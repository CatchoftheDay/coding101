import React, { ReactNode } from "react";

import {
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";
import { ItemTypes } from "../constants";

const Condition = ({
  condition,
  placeholder = <span style={{ fontStyle: "italic" }}>(Always)</span>,
  connectDragSource
}: {
  condition?: string;
  placeholder?: ReactNode;
  connectDragSource: ConnectDragSource;
}) =>
  connectDragSource(
    <div
      style={{
        display: "inline-block",
        border: `1px ${condition ? "solid" : "dashed"} black`,
        borderRadius: "20px",
        padding: "5px",
        flex: 1
      }}
    >
      {condition || placeholder}
    </div>
  );

const actionSource = {
  beginDrag({ condition }: { condition: string }) {
    return { condition };
  },
  canDrag({ condition }: { condition?: string }) {
    return !!condition;
  }
};

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource(ItemTypes.CONDITION, actionSource, collect)(
  Condition
);
