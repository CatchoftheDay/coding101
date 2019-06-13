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
      (step && !acceptHoverByStep[step.id]) ||
      !monitor.isOver({ shallow: true }) ||
      draggedStep === step ||
      ((step || parent) && isAncestor((step || parent)!, draggedStep))
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
      dragIndex !== -1 &&
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

    let before;
    if (
      !step ||
      (step === siblings[siblings.length - 1] && hoverClientY > hoverMiddleY)
    ) {
      before = undefined;
    } else {
      before = step;
    }

    if (onInsert) {
      onInsert(draggedStep, parent, before);
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
