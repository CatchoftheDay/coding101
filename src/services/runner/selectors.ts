import { getNextSibling, getParentStep, getStep } from "../script/selectors";
import {
  ActionStep,
  BranchStep,
  ConditionalStep,
  Step,
  WhileStep
} from "../script/types";
import { flattenSteps } from "../script/reducers";
import { RunnerState } from "./types";
import { leftOf, rightOf } from "../maze/maze";
import { AnyAction } from "redux";
import { moveForward, turnLeft, turnRight } from "./actions";

/** Returns true if we've crashed */
export const isCrashed = (state: RunnerState) => state.crashed;
/** Returns true if we're currently at the maze's exit */
export const isAtExit = (state: RunnerState) =>
  state.location.x === state.maze.width - 1 &&
  state.location.y === state.maze.height - 1;
/** Returns true if we're able to move left from our current location */
export const canMoveLeft = (state: RunnerState) =>
  !getMaze(state).hasWall(getLocation(state), leftOf(getFacing(state)));
/** Returns true if we're able to move forward from our current location */
export const canMoveForward = (state: RunnerState) =>
  !getMaze(state).hasWall(getLocation(state), getFacing(state));
/** Returns true if we're able to move right from our current location */
export const canMoveRight = (state: RunnerState) =>
  !getMaze(state).hasWall(getLocation(state), rightOf(getFacing(state)));

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
    case !step.condition || conditionMet(state, step.condition):
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
    case !step.condition || conditionMet(state, step.condition):
      // If our condition is met(or we don't have one), always go to the first
      // step
      return step.steps[0];
    default:
      // Our condition is not met
      return undefined;
  }
};

/** Returns true if the condition is currently met */
const conditionMet = (state: RunnerState, condition: string) =>
  conditions[condition](state);

/** Returns true if this step should be skipped (ie not stopped on) */
const shouldSkip = ({ type }: Step) => type === "branch";

const actions: { [actionName: string]: AnyAction } = {
  turnLeft: turnLeft(),
  turnRight: turnRight(),
  moveForward: moveForward()
};

const conditions: { [condition: string]: (state: RunnerState) => boolean } = {
  atExit: state => isAtExit(state),
  notAtExit: state => !isAtExit(state),
  canMoveLeft,
  canMoveForward,
  canMoveRight
};
