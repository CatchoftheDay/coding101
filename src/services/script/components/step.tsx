import React from "react";
import { NonConditionStep, Step as StepModel } from "../types";
import Action from "./action";
import Branch from "./branch";
import While from "./while";
import {
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";
import { ItemTypes } from "../constants";

const Step = ({
  connectDragSource,
  step
}: {
  connectDragSource: ConnectDragSource;
  step: NonConditionStep;
}) => {
  let node;

  if (step.type === "action") {
    node = <Action step={step} />;
  } else if (step.type === "while") {
    node = <While step={step} />;
  } else if (step.type === "branch") {
    node = <Branch step={step} />;
  }

  return connectDragSource(<div>{node}</div>);
};

const actionSource = {
  beginDrag({ step: { id } }: { step: StepModel }) {
    return { id };
  }
};

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource(ItemTypes.STEP, actionSource, collect)(Step);
