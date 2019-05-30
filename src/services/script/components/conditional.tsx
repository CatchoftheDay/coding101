import React from "react";
import { ConditionalStep } from "../types";
import Step from "./step";
import Condition from "./condition";
import {
  ConnectDropTarget,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
import { ItemTypes } from "../constants";

const Conditional = ({
  step,
  conditionLabel,
  stepsLabel,
  connectDropTarget,
  isOver,
  canDrop
}: {
  step?: ConditionalStep;
  conditionLabel: string;
  stepsLabel: string;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
}) => {
  return connectDropTarget(
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "5px"
        }}
      >
        <div style={{ display: "inline-block", width: "5em" }}>
          {conditionLabel}
        </div>
        <Condition
          style={{ background: isOver && canDrop ? "#afa" : null, flex: 1 }}
          condition={step && step.condition}
        />
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "5px"
        }}
      >
        <div style={{ display: "inline-block", width: "5em" }}>
          {stepsLabel}
        </div>
        <div style={{ display: "inline-block", flex: 1 }}>
          {step && step.steps.map(step => <Step key={step.id} step={step} />)}
        </div>
      </div>
    </div>
  );
};

const conditionTarget = {
  drop(props: any) {
    console.log("dropped condition", props);
  }
};

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop()
});

export default DropTarget(ItemTypes.CONDITION, conditionTarget, collect)(
  Conditional
);
