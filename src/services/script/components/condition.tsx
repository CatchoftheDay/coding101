import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useRef
} from "react";
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
import {
  Condition as ConditionModel,
  ConditionalStep,
  Script,
  Step as StepModel,
  WhileStep
} from "../types";
import { Dispatch } from "redux";
import { deleteCondition, insertCondition, negateCondition } from "../actions";
import { buildSurround } from "../util";
import { conditions } from "../../../constants";
import { getConditionParentStep } from "../selectors";

const notNegatedColor = "rgba(0, 0, 0, 0.25)";
const negatedColor = "rgba(0, 0, 0, 0.66)";

interface ConditionProps {
  step?: ConditionalStep | WhileStep;
  activeStep?: StepModel;
  condition?: ConditionModel;
  script?: Script;
  placeholder?: ReactNode;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  style?: CSSProperties;
  className?: string;
  isOver: boolean;
  canDrop: boolean;
  dispatch: Dispatch;
}

interface ConditionInstance {
  getNode(): HTMLSpanElement | null;
}

const Condition = React.forwardRef(
  (
    {
      step,
      activeStep,
      condition,
      placeholder = "(Always)",
      connectDragSource,
      connectDropTarget,
      dispatch,
      style
    }: ConditionProps,
    ref
  ) => {
    const elementRef = useRef(null);

    connectDragSource(elementRef);
    if (step) {
      connectDropTarget(elementRef);
    }

    useImperativeHandle<{}, ConditionInstance>(ref, () => ({
      getNode: () => elementRef.current
    }));

    return (
      <div ref={elementRef} style={style}>
        {buildSurround(
          {
            highlight: step && step === activeStep,
            onDelete:
              step && condition
                ? () => dispatch(deleteCondition(condition.id))
                : undefined,
            style: {
              borderColor: "#f58928",
              borderRadius: "20px",
              borderStyle: condition ? "solid" : "dashed",
              backgroundColor: "#fff4eb"
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
                    condition.negated ? negatedColor : notNegatedColor
                  }`,
                  borderRadius: "2rem",
                  marginRight: "0.5rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  dispatch(negateCondition(step.id, condition.id));
                }}
                title={
                  "When active, negates the condition. For example, 'At finish' would become 'Not at finish'"
                }
              >
                <FontAwesomeIcon
                  icon={faExclamation}
                  color={condition.negated ? negatedColor : notNegatedColor}
                />
              </span>
            )}
            {condition ? (
              getLabel(condition.condition)
            ) : (
              <span style={{ fontStyle: "italic" }}>{placeholder}</span>
            )}
          </span>
        )}
      </div>
    );
  }
);

const actionSource = {
  beginDrag({ condition, script }: ConditionProps) {
    return script
      ? condition
      : ({ ...condition, id: Math.random() } as ConditionModel);
  },
  canDrag({ condition }: ConditionProps) {
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
  hover(
    {
      dispatch,
      step,
      condition: targetCondition,
      script
    }: ConditionProps & { step: ConditionalStep; condition: ConditionModel },
    monitor: DropTargetMonitor,
    component: ConditionInstance
  ) {
    const node = component && component.getNode();
    const draggedCondition = monitor.getItem() as ConditionModel;

    if (
      !node ||
      !monitor.isOver({ shallow: true }) ||
      targetCondition === draggedCondition
    ) {
      return;
    }

    const draggedParentStep = getConditionParentStep(script!, draggedCondition);
    const siblings = step.conditions;
    const sameParent = draggedParentStep === step;
    const hoverBoundingRect = node.getBoundingClientRect();
    const hoverHalfY = hoverBoundingRect.top + hoverBoundingRect.height / 2;
    const hoverY = monitor.getClientOffset()!.y;

    let insertAfter: boolean;
    if (sameParent) {
      const dragIndex = draggedParentStep!.conditions.indexOf(draggedCondition);

      insertAfter =
        dragIndex !== -1 && dragIndex < siblings.indexOf(targetCondition);
    } else {
      insertAfter = hoverY > hoverHalfY;
    }

    const insertIdx = step
      ? siblings.indexOf(targetCondition) + (insertAfter ? 1 : 0)
      : 0;

    if (
      !siblings[insertIdx] ||
      siblings[insertIdx].id !== draggedCondition.id
    ) {
      console.log(
        insertIdx,
        siblings[insertIdx] && siblings[insertIdx].id,
        draggedCondition.id
      );
      dispatch(
        insertCondition(
          step.id,
          draggedCondition,
          siblings[insertIdx] && siblings[insertIdx].id
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
