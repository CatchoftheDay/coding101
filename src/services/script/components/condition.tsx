import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import React, { CSSProperties, ReactElement, ReactNode } from "react";
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
import { setConditions } from "../actions";
import { buildSurround } from "../util";
import { conditions } from "../../../constants";

const notFadedColor = "rgba(0, 0, 0, 0.25)";
const notEnabledColor = "rgba(0, 0, 0, 0.66)";

interface ConditionProps {
  step?: ConditionalStep | WhileStep;
  activeStep?: StepModel;
  conditions: string[];
  conditionIdx: number;
  placeholder?: ReactNode;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  style?: CSSProperties;
  className?: string;
  isOver: boolean;
  canDrop: boolean;
  dispatch: Dispatch;
}

const Condition = ({
  step,
  activeStep,
  conditions,
  conditionIdx,
  placeholder = <span style={{ fontStyle: "italic" }}>(Always)</span>,
  connectDragSource,
  connectDropTarget,
  isOver,
  canDrop,
  dispatch,
  style
}: ConditionProps) => {
  const condition = conditions[conditionIdx];

  return connectDragSource(
    connectDropTarget(
      buildSurround(
        {
          highlight: step && step === activeStep,
          onDelete:
            step && condition
              ? () => dispatch(setConditions(step.id, []))
              : undefined,
          style: {
            borderColor: "#f58928",
            borderRadius: "20px",
            backgroundColor: isOver && canDrop ? "#ffe6d0" : "#fff4eb",
            ...style
          }
        },
        <span style={{ flex: 1 }}>
          {step && condition && (
            <span
              style={{
                display: "inline-block",
                fontSize: "80%",
                width: "1.6em",
                textAlign: "center",
                border: `1px solid ${
                  condition[0] === "!" ? notEnabledColor : notFadedColor
                }`,
                borderRadius: "2rem",
                marginRight: "0.5rem",
                cursor: "pointer"
              }}
              onClick={() => {
                const newConditions = conditions.slice();
                newConditions[conditionIdx] =
                  condition[0] === "!" ? condition.substr(1) : `!${condition}`;

                dispatch(setConditions(step.id, newConditions));
              }}
              title={
                "When active, negates the condition. For example, 'At finish' would become 'Not at finish'"
              }
            >
              <FontAwesomeIcon
                icon={faExclamation}
                color={condition[0] === "!" ? notEnabledColor : notFadedColor}
              />
            </span>
          )}
          {condition ? getLabel(condition.replace(/^!/, "")) : placeholder}
        </span>
      )
    )
  );
};

const actionSource = {
  beginDrag({
    conditions,
    conditionIdx,
    step
  }: {
    conditions: string[];
    conditionIdx: number;
    step?: ConditionalStep | WhileStep;
  }) {
    return {
      condition: conditions[conditionIdx],
      conditions,
      conditionIdx,
      step
    };
  },
  canDrag({ conditions }: ConditionProps) {
    return conditions.length > 0;
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
    { dispatch, step: targetStep }: ConditionProps,
    monitor: DropTargetMonitor
  ) {
    const {
      condition,
      conditionIdx,
      conditions,
      step: sourceStep
    } = monitor.getItem() as {
      condition: string;
      conditionIdx: number;
      conditions: string[];
      step: ConditionalStep;
    };

    if (!targetStep || sourceStep === targetStep) {
      // They dragged it on top of itself, so nothing to do
      return;
    }

    targetStep.conditions.concat(condition);

    dispatch(
      setConditions(targetStep.id, targetStep.conditions.concat(condition))
    );

    if (sourceStep) {
      dispatch(
        setConditions(
          sourceStep.id,
          conditions.filter((_, idx) => idx !== conditionIdx)
        )
      );
    }
  }
};

const dropCollect = (
  connect: DropTargetConnector,
  monitor: DropTargetMonitor,
  { step }: ConditionProps
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop:
    !!step && monitor.canDrop() && monitor.getItemType() === ItemTypes.CONDITION
});

/** Returns the label for the given condition */
const getLabel = (conditionId: string) =>
  conditions.reduce(
    (label: ReactElement | string | undefined, condition) =>
      condition.id === conditionId ? condition.label : label,
    undefined
  );

export default connect()(
  DropTarget(ItemTypes.CONDITION, conditionTarget, dropCollect)(
    DragSource(ItemTypes.CONDITION, actionSource, dragCollect)(Condition)
  )
);
