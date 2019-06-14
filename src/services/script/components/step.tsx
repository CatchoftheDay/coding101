import React, { CSSProperties, useImperativeHandle, useRef } from "react";
import { fixRegistry } from "../../patches";
import {
  NonConditionalStep,
  OnInsert,
  Script,
  Step as StepModel
} from "../types";
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
import { getChildren, getSiblingIndex, isAncestor } from "../selectors";
import { buildSurround, isAcceptHover, startDrag, stopDrag } from "../util";

interface StepProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  step?: NonConditionalStep;
  parent?: StepModel;
  activeStep?: StepModel;
  crashed?: boolean;
  script?: Script;
  onDelete?: (step: StepModel) => void;
  style?: CSSProperties;
  onInsert?: OnInsert;
  paletteItem?: boolean;
  canDrop: boolean;
}

const Step = React.forwardRef(
  (
    {
      connectDragSource,
      connectDropTarget,
      step,
      script,
      crashed,
      activeStep,
      onDelete,
      onInsert,
      style,
      paletteItem,
      canDrop
    }: StepProps,
    ref
  ) => {
    const elementRef = useRef(null);

    if (step) {
      connectDragSource(elementRef);
    }
    if (script && onInsert) {
      connectDropTarget(elementRef);

      if (step) {
        if (canDrop) {
          startDrag(step.id);
        } else {
          stopDrag(step.id);
        }
      }
    }
    useImperativeHandle<{}, StepInstance>(ref, () => ({
      getNode: () => elementRef.current
    }));

    let node;

    if (!step) {
      node = buildSurround(
        {
          placeholder: true,
          style: {
            color: "grey",
            borderColor: "grey"
          }
        },
        <span>(Drag step here)</span>
      );
    } else if (step.type === "action") {
      node = (
        <Action
          step={step}
          crashed={crashed}
          activeStep={activeStep}
          onDelete={onDelete}
        />
      );
    } else if (step.type === "while") {
      node = (
        <While
          step={step}
          script={script}
          crashed={crashed}
          activeStep={activeStep}
          onInsert={onInsert}
          onDelete={onDelete}
          paletteItem={paletteItem}
        />
      );
    } else if (step.type === "branch") {
      node = (
        <Branch
          step={step}
          script={script}
          crashed={crashed}
          activeStep={activeStep}
          onInsert={onInsert}
          onDelete={onDelete}
          paletteItem={paletteItem}
        />
      );
    }

    return (
      <div style={{ whiteSpace: "nowrap", ...style }} ref={elementRef}>
        {node}
      </div>
    );
  }
);

interface StepInstance {
  getNode(): HTMLDivElement | null;
}

const dragSource = {
  beginDrag({ step, script }: StepProps) {
    if (!script) {
      step = { ...step, id: Math.random() } as NonConditionalStep;
    }

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
    {
      step,
      parent,
      script,
      onInsert,
      canDrop
    }: StepProps & { script: Script; canDrop: boolean },
    monitor: DropTargetMonitor,
    component: StepInstance
  ) {
    fixRegistry(monitor);

    const draggedStep = monitor.getItem().step;
    const siblings = parent ? getChildren(parent) : script;
    const node = component && component.getNode();
    const dragIndex = getSiblingIndex(script, draggedStep);

    if (
      !node ||
      !onInsert ||
      (step && !isAcceptHover(step.id)) ||
      !monitor.isOver({ shallow: true }) ||
      ((step || parent) && isAncestor((step || parent)!, draggedStep))
    ) {
      return;
    }

    const sameParent = siblings.indexOf(draggedStep) !== -1;
    const hoverBoundingRect = node.getBoundingClientRect();
    const hoverHalfY = hoverBoundingRect.top + hoverBoundingRect.height / 2;
    const hoverY = monitor.getClientOffset()!.y;

    let insertAfter: boolean;
    if (sameParent) {
      insertAfter = dragIndex !== -1 && dragIndex < siblings.indexOf(step!);
    } else {
      insertAfter = hoverY > hoverHalfY;
    }

    const insertIdx = step ? siblings.indexOf(step) + (insertAfter ? 1 : 0) : 0;

    if (!siblings[insertIdx] || siblings[insertIdx].id !== draggedStep.id) {
      onInsert(draggedStep, parent, siblings[insertIdx]);
    }
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

export default DropTarget(ItemTypes.STEP, dropTarget, dropCollect)(
  DragSource(ItemTypes.STEP, dragSource, dragCollect)(Step)
);
