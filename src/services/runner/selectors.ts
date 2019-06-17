import { getNextSibling, getParentStep, getStep } from "../script/selectors";
import {
  ActionStep,
  BranchStep,
  Condition,
  ConditionalStep,
  Step,
  WhileStep
} from "../script/types";
import { flattenSteps } from "../script/reducers";
import { RunnerState } from "./types";
import { leftOf, rightOf } from "../maze/maze";
import { AnyAction } from "redux";
import { moveForward, turnLeft, turnRight } from "./actions";
import {
  DOOR_IN_FRONT,
  DOOR_ON_LEFT,
  DOOR_ON_RIGHT,
  HAS_KEY_SET,
  ON_KEY,
  WALL_IN_FRONT,
  WALL_ON_LEFT,
  WALL_ON_RIGHT
} from "../../constants";

/** Returns true if we've crashed */
export const isCrashed = (state: RunnerState) => state.crashed;
/** True if the program has completed */
export const isDone = (state: RunnerState) => state.currStepId === undefined;
/** Returns true if we're currently at the maze's exit */
export const isAtFinish = (state: RunnerState) =>
  state.location.x === state.maze.width - 1 &&
  state.location.y === state.maze.height - 1;
/** Returns true if there's a wall on the left of our current location */
export const wallOnLeft = (state: RunnerState) =>
  getMaze(state).hasWall(getLocation(state), leftOf(getFacing(state)));
/** Returns true if there's a wall in front of our current location */
export const wallInFront = (state: RunnerState) =>
  getMaze(state).hasWall(getLocation(state), getFacing(state));
/** Returns true if there's a wall on the right of our current location */
export const wallOnRight = (state: RunnerState) =>
  getMaze(state).hasWall(getLocation(state), rightOf(getFacing(state)));
/** Returns true if there's a door on the left of our current location */
export const doorOnLeft = (state: RunnerState) =>
  getMaze(state).hasDoor(getLocation(state), leftOf(getFacing(state)));
/** Returns true if there's a door in front of our current location */
export const doorInFront = (state: RunnerState) =>
  getMaze(state).hasDoor(getLocation(state), getFacing(state));
/** Returns true if there's a door on the right of our current location */
export const doorOnRight = (state: RunnerState) =>
  getMaze(state).hasDoor(getLocation(state), rightOf(getFacing(state)));
/** Returns true if we're on top of the key */
export const onKey = (state: RunnerState) => {
  const { location } = state;
  const { keyLocation } = getMaze(state);

  return keyLocation.x === location.x && keyLocation.y === location.y;
};
/** Returns true if the key has been picked up */
export const hasKey = (state: RunnerState) => state.hasKey;
/** Returns true if the hasKey variable is set */
export const hasKeySet = (state: RunnerState) => state.variables.hasKey;
/** Returns true if the door has been opened */
export const doorOpen = (state: RunnerState) => state.doorOpen;

export const getLocation = (state: RunnerState) => state.location;
export const getFacing = (state: RunnerState) => state.facing;
export const getMaze = (state: RunnerState) => state.maze;
export const getScript = (state: RunnerState) => state.script;
export const getCurrentStepId = (state: RunnerState) => state.currStepId;
export const getCurrentStep = (state: RunnerState) => {
  const stepId = getCurrentStepId(state);
  return stepId !== undefined ? getStep(getScript(state), stepId) : undefined;
};

export const getCurrentAction = (state: RunnerState) => {
  const step = getCurrentStep(state);

  if (step && step.type === "action") {
    return actions[step.action];
  }
};

/** Gets the step that should proceed the current step */
export const getNextStepId = (state: RunnerState) => {
  const currState = { ...state };
  let nextStep = getCurrentStep(state);

  do {
    nextStep = getNextStepFrom(currState, nextStep);
    currState.currStepId = nextStep && nextStep.id;
  } while (nextStep && shouldSkip(nextStep));

  return nextStep && nextStep.id;
};

/** Gets the step that should proceed the given step */
const getNextStepFrom = (
  state: RunnerState,
  step: Step | undefined
): Step | undefined => {
  if (step) {
    return (
      getNextSiblingOrChildStepFrom(state, step) ||
      getNextStepFrom(state, getParentStep(getScript(state), step))
    );
  } else {
    return undefined;
  }
};

/** Gets the next sibling or child step (but not a parent) that should proceed step */
const getNextSiblingOrChildStepFrom = (state: RunnerState, step: Step) => {
  switch (step.type) {
    case "action":
      return getNextStep_action(state, step);
    case "branch":
      return getNextStep_branch(state, step);
    case "conditional":
      return getNextStep_condition(state, step);
    case "while":
      return getNextStep_while(state, step);
  }
};

/** Gets the next step given the current step is an ActionStep */
const getNextStep_action = (state: RunnerState, step: ActionStep) =>
  getNextSibling(getScript(state), step);

/** Gets the next step given the current step is a BranchStep */
const getNextStep_branch = (state: RunnerState, step: BranchStep) => {
  const currentStep = getCurrentStep(state);

  switch (true) {
    case !!step.conditions.find(condition => condition === currentStep):
      // If the current step is one of our conditions, that condition was *not*
      // satisfied, so move on to the next condition
      return getNextSibling(getScript(state), currentStep!);
    case flattenSteps(step.conditions).includes(currentStep!):
      // If the current step is a child of one of our conditions, then that
      // condition was executed so we should return undefined
      return undefined;
    default:
      // Otherwise we're entering this step, so move to our first condition
      return step.conditions[0];
  }
};

/** Gets the next step given the current step is a ConditionalStep */
const getNextStep_condition = (state: RunnerState, step: ConditionalStep) => {
  const currentStep = getCurrentStep(state);

  switch (true) {
    case flattenSteps(step.steps).includes(currentStep!):
      // If we're being asked and the current step is a child of ours, we should
      // return undefined to indicate that we have finished all our steps
      return undefined;
    case step.conditions.every(condition => conditionMet(state, condition)):
      // The current step is not one of our children and we either don't have
      // a condition or our condition is met
      return step.steps[0];
    default:
      // The current step is not one of our children and our condition is
      // not met, so go to our next sibling
      return undefined;
  }
};

/** Gets the next step given the current step is a WhileStep */
const getNextStep_while = (state: RunnerState, step: WhileStep) => {
  const currentStep = getCurrentStep(state);

  switch (true) {
    case flattenSteps(step.steps).includes(currentStep!):
      // The current step is one of our descendents; so the next step should be us
      return step;
    case step.conditions.every(condition => conditionMet(state, condition)):
      // If our condition is met(or we don't have one), always go to the first
      // step
      return step.steps[0];
    default:
      // Our condition is not met
      return undefined;
  }
};

/** Returns true if the condition is currently met */
const conditionMet = (
  state: RunnerState,
  { condition, negated }: Condition
) => {
  const result = conditions[condition](state);

  return negated ? !result : result;
};

/** Returns true if this step should be skipped (ie not stopped on) */
const shouldSkip = ({ type }: Step) => type === "branch";

const actions: { [actionName: string]: AnyAction } = {
  turnLeft: turnLeft(),
  turnRight: turnRight(),
  moveForward: moveForward()
};

const conditions: { [condition: string]: (state: RunnerState) => boolean } = {
  atFinish: state => isAtFinish(state),
  [WALL_ON_LEFT]: wallOnLeft,
  [WALL_IN_FRONT]: wallInFront,
  [WALL_ON_RIGHT]: wallOnRight,
  [DOOR_ON_LEFT]: doorOnLeft,
  [DOOR_IN_FRONT]: doorInFront,
  [DOOR_ON_RIGHT]: doorOnRight,
  [ON_KEY]: onKey,
  [HAS_KEY_SET]: hasKeySet
};
