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
import { ConditionalStep, Step as StepModel, WhileStep } from "../types";
import { Dispatch } from "redux";
import { setCondition } from "../actions";
import { buildSurround } from "../util";

const Condition = ({
  step,
  activeStep,
  condition,
  placeholder = <span style={{ fontStyle: "italic" }}>(Always)</span>,
  connectDragSource,
  connectDropTarget,
  isOver,
  canDrop,
  dispatch
}: {
  step?: ConditionalStep | WhileStep;
  activeStep?: StepModel;
  condition?: string;
  placeholder?: ReactNode;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  style?: CSSProperties;
  className?: string;
  isOver: boolean;
  canDrop: boolean;
  dispatch: Dispatch;
}) =>
  connectDragSource(
    connectDropTarget(
      buildSurround(
        {
          highlight: step && step === activeStep,
          onDelete:
            step && condition
              ? () => dispatch(setCondition(step.id, null))
              : undefined,
          style: {
            borderColor: "#f58928",
            borderRadius: "20px",
            backgroundColor: isOver && canDrop ? "green" : "white"
          }
        },
        <span style={{ flex: 1 }}>{condition || placeholder}</span>
      )
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

    if (!targetStep || sourceStep === targetStep) {
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
  monitor: DropTargetMonitor,
  { step }: { step?: StepModel }
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop:
    !!step && monitor.canDrop() && monitor.getItemType() === ItemTypes.CONDITION
});

export default connect()(
  DropTarget(ItemTypes.CONDITION, conditionTarget, dropCollect)(
    DragSource(ItemTypes.CONDITION, actionSource, dragCollect)(Condition)
  )
);
