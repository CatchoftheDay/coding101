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
import { connect } from "react-redux";
import { ItemTypes } from "../constants";
import { ConditionalStep, WhileStep } from "../types";
import { Dispatch } from "redux";
import { setCondition } from "../actions";

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
  step?: ConditionalStep | WhileStep;
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
  beginDrag({
    condition,
    step
  }: {
    condition: string;
    step?: ConditionalStep | WhileStep;
  }) {
    return { condition, step };
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
  drop(
    {
      dispatch,
      step: targetStep
    }: {
      dispatch: Dispatch;
      step: ConditionalStep | WhileStep;
    },
    monitor: DropTargetMonitor
  ) {
    const { condition, step: sourceStep } = monitor.getItem();

    if (sourceStep === targetStep) {
      // They dragged it on top of itself, so nothing to do
      return;
    }

    dispatch(setCondition(targetStep.id, condition));

    if (sourceStep) {
      dispatch(setCondition(sourceStep.id, null));
    }
  }
};

const dropCollect = (
  connect: DropTargetConnector,
  monitor: DropTargetMonitor
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop() && monitor.getItemType() === ItemTypes.CONDITION
});

export default connect()(
  DropTarget(ItemTypes.CONDITION, conditionTarget, dropCollect)(
    DragSource(ItemTypes.CONDITION, actionSource, dragCollect)(Condition)
  )
);
