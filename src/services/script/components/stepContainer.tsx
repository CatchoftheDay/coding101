import React from "react";
import {
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
import { NonConditionStep } from "../types";
import Step from "./step";
import { ItemTypes } from "../constants";

const StepContainer = ({
  steps,
  connectDropTarget
}: {
  steps: ReadonlyArray<NonConditionStep>;
  connectDropTarget: ConnectDropTarget;
}) =>
  connectDropTarget(
    <div>
      {steps.map(step => (
        <Step key={step.id} step={step} />
      ))}
    </div>
  );

const stepTarget = {
  drop(props: any) {
    console.log("dropped", props);
  }
};

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export default DropTarget(ItemTypes.STEP, stepTarget, collect)(StepContainer);
