import React, { useImperativeHandle, useRef } from "react";
import { fixRegistry } from "../../patches";
import { NonConditionalStep, Script, Step as StepModel } from "../types";
import Action from "./action";
import Branch from "./branch";
import While from "./while";
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
import { connect } from "react-redux";
import {
  getChildren,
  getParentStep,
  getSiblingIndex,
  isAncestor
} from "../selectors";
import { Dispatch } from "redux";
import { insertStep } from "../actions";

interface StepProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  step?: NonConditionalStep;
  parent?: StepModel;
  script: Script;
}

const Step = React.forwardRef(
  ({ connectDragSource, connectDropTarget, step }: StepProps, ref) => {
    const elementRef = useRef(null);

    if (step) {
      connectDragSource(elementRef);
    }
    connectDropTarget(elementRef);
    useImperativeHandle<{}, StepInstance>(ref, () => ({
      getNode: () => elementRef.current
    }));

    let node;

    if (!step) {
      node = <div>(Drag step here)</div>;
    } else if (step.type === "action") {
      node = <Action step={step} />;
    } else if (step.type === "while") {
      node = <While step={step} />;
    } else if (step.type === "branch") {
      node = <Branch step={step} />;
    }

    return <div ref={elementRef}>{node}</div>;
  }
);

interface StepInstance {
  getNode(): HTMLDivElement | null;
}

const dragSource = {
  beginDrag({ step, script }: StepProps) {
    return { step, script };
  }
};

const dragCollect = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const dropTarget = {
  hover(
    { step, parent, script, dispatch }: StepProps & { dispatch: Dispatch },
    monitor: DropTargetMonitor,
    component: StepInstance
  ) {
    fixRegistry(monitor);

    const draggedStep = monitor.getItem().step;
    const dragParent = getParentStep(script, draggedStep);
    const siblings = parent ? getChildren(parent) : script;
    const node = component && component.getNode();
    const dragIndex = getSiblingIndex(script, draggedStep);
    const hoverIndex = step ? siblings.indexOf(step) : 0;

    if (
      !node ||
      !monitor.isOver({ shallow: true }) ||
      draggedStep === step ||
      (step && isAncestor(step, draggedStep))
    ) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = node.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()!;

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (
      dragParent === parent &&
      dragIndex < hoverIndex &&
      hoverClientY < hoverMiddleY
    ) {
      return;
    }

    // Dragging upwards
    if (
      dragParent === parent &&
      dragIndex > hoverIndex &&
      hoverClientY > hoverMiddleY
    ) {
      return;
    }

    let beforeId;
    if (
      !step ||
      (step === siblings[siblings.length - 1] && hoverClientY > hoverMiddleY)
    ) {
      beforeId = null;
    } else {
      beforeId = step.id;
    }

    dispatch(insertStep(draggedStep, (parent && parent.id) || null, beforeId));
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

const mapStateToProps = (script: Script) => ({ script });

export default connect(mapStateToProps)(
  DropTarget(ItemTypes.STEP, dropTarget, dropCollect)(
    DragSource(ItemTypes.STEP, dragSource, dragCollect)(Step)
  )
);
