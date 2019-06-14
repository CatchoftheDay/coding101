import React, { CSSProperties, useImperativeHandle, useRef } from "react";
import {
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
import { ItemTypes } from "../constants";
import { isAncestor } from "../selectors";
import {
  ConditionalStep,
  OnInsert,
  Script,
  Step as StepModel,
  WhileStep
} from "../types";
import { isAcceptHover, startDrag, stopDrag } from "../util";
import Condition from "./condition";
import DeleteButton from "./deleteButton";
import StepList from "./stepList";

interface ConditionalProps {
  step?: ConditionalStep | WhileStep;
  parent?: StepModel;
  script?: Script;
  crashed?: boolean;
  activeStep?: StepModel;
  canDrop: boolean;
  conditionLabel: string;
  stepsLabel: string;
  showDelete?: boolean;
  onDelete?: (step: StepModel) => void;
  onInsert?: OnInsert;
  style?: CSSProperties;
  connectDropTarget: ConnectDropTarget;
}

const Conditional = React.forwardRef(
  (
    {
      step,
      script,
      crashed,
      activeStep,
      canDrop,
      conditionLabel,
      stepsLabel,
      style,
      onDelete,
      showDelete,
      onInsert,
      connectDropTarget,
      isOver
    }: ConditionalProps & { isOver: boolean },
    ref
  ) => {
    const elementRef = useRef(null);

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

    useImperativeHandle<{}, ConditionalInstance>(ref, () => ({
      getNode: () => elementRef.current
    }));

    return (
      <div ref={elementRef} style={{ display: "flex", ...style }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "inline-block", width: "5em" }}>
              {conditionLabel}
            </div>
            <Condition
              style={{ flex: 1 }}
              step={step}
              activeStep={activeStep}
              condition={(step && step.condition) || undefined}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "inline-block",
                width: "5em",
                marginTop: "11px"
              }}
            >
              {stepsLabel}
            </div>
            <div style={{ display: "inline-block", flex: 1 }}>
              {step && (
                <StepList
                  steps={step.steps}
                  script={script}
                  crashed={crashed}
                  activeStep={activeStep}
                  parent={step}
                  onDelete={onDelete}
                  onInsert={onInsert}
                />
              )}
            </div>
          </div>
        </div>
        {step && onDelete && showDelete && (
          <DeleteButton onClick={() => onDelete(step)} />
        )}
      </div>
    );
  }
);

interface ConditionalInstance {
  getNode(): HTMLDivElement | null;
}

const dropTarget = {
  hover(
    {
      step,
      parent,
      script,
      onInsert,
      canDrop
    }: ConditionalProps & { script: Script; canDrop: boolean },
    monitor: DropTargetMonitor,
    component: ConditionalInstance
  ) {
    const draggedStep = monitor.getItem().step;
    const node = component && component.getNode();

    if (
      !step ||
      !node ||
      !onInsert ||
      (step && !isAcceptHover(step.id)) ||
      !monitor.isOver({ shallow: true }) ||
      ((step || parent) && isAncestor((step || parent)!, draggedStep)) ||
      step.steps.find(s => draggedStep.id === s.id)
    ) {
      return;
    }

    onInsert(draggedStep, step, step.steps[0]);
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

export default DropTarget(ItemTypes.STEP, dropTarget, dropCollect)(Conditional);
