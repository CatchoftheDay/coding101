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
import {
  getChildren,
  getParentStep,
  getSiblingIndex,
  isAncestor
} from "../selectors";
import { buildSurround } from "../util";

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

// Workaround for hover() being called with incorrect monitor.isOver({shallow: true}) values the first time */
const acceptHoverByStep: { [stepId: string]: boolean } = {};
const acceptHoverTimeouts: { [stepId: string]: number } = {};

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
        if (canDrop && !acceptHoverTimeouts[step.id]) {
          acceptHoverTimeouts[step.id] = window.setTimeout(() => {
            acceptHoverByStep[step.id] = true;
          }, 200);
        } else if (!canDrop && acceptHoverTimeouts[step.id]) {
          clearTimeout(acceptHoverTimeouts[step.id]);
          delete acceptHoverTimeouts[step.id];
          delete acceptHoverByStep[step.id];
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
    const dragParent = getParentStep(script, draggedStep);
    const siblings = parent ? getChildren(parent) : script;
    const node = component && component.getNode();
    const dragIndex = getSiblingIndex(script, draggedStep);
    let hoverIndex = step ? siblings.indexOf(step) : 0;

    if (
      !node ||
      !onInsert ||
      (step && !acceptHoverByStep[step.id]) ||
      !monitor.isOver({ shallow: true }) ||
      ((step || parent) && isAncestor((step || parent)!, draggedStep))
    ) {
      return;
    }

    const hoverBoundingRect = node.getBoundingClientRect();
    const hoverTopThirdY = hoverBoundingRect.top + hoverBoundingRect.height / 3;
    const hoverHalfY = hoverBoundingRect.top + hoverBoundingRect.height / 2;
    const hoverBottomThirdY =
      hoverBoundingRect.bottom - hoverBoundingRect.height / 3;
    const hoverY = monitor.getClientOffset()!.y;

    let insertAfter: boolean;

    if (dragParent === parent) {
      const draggingDown = dragIndex !== -1 && dragIndex < hoverIndex;
      const draggingUp = dragParent === parent && dragIndex > hoverIndex;

      insertAfter =
        (draggingDown && hoverY > hoverTopThirdY) ||
        (draggingUp && hoverY > hoverBottomThirdY);
    } else {
      insertAfter = hoverY > hoverHalfY;
    }

    if (insertAfter) {
      hoverIndex++;
    }

    if (siblings[hoverIndex] !== draggedStep) {
      onInsert(draggedStep, parent, siblings[hoverIndex]);
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
