import React, { CSSProperties, ReactNode } from "react";

import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
import { ItemTypes } from "../constants";

const Condition = ({
  condition,
  placeholder = <span style={{ fontStyle: "italic" }}>(Always)</span>,
  connectDragSource,
  connectDropTarget,
  style,
  className,
  isOver,
  canDrop
}: {
  condition?: string;
  placeholder?: ReactNode;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  style?: CSSProperties;
  className?: string;
  isOver: boolean;
  canDrop: boolean;
}) =>
  connectDragSource(
    connectDropTarget(
      <div
        className={className}
        style={{
          display: "inline-block",
          border: `1px ${condition ? "solid" : "dashed"} black`,
          background: isOver && canDrop ? "green" : "white",
          borderRadius: "20px",
          padding: "5px",
          ...style
        }}
      >
        {condition || placeholder}
      </div>
    )
  );

const actionSource = {
  beginDrag({ condition }: { condition: string }) {
    return { condition };
  },
  canDrag({ condition }: { condition?: string }) {
    return !!condition;
  }
};

const dragCollect = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const conditionTarget = {
  drop(props: any) {
    console.log("dropped condition", props);
  }
};

const dropCollect = (
  connect: DropTargetConnector,
  monitor: DropTargetMonitor
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop()
});

export default DropTarget(ItemTypes.CONDITION, conditionTarget, dropCollect)(
  DragSource(ItemTypes.CONDITION, actionSource, dragCollect)(Condition)
);
