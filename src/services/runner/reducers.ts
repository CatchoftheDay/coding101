import { createReducer } from "deox";
import {
  clearHasKey,
  grabKey,
  moveForward,
  newMaze,
  openDoor,
  reset,
  run,
  setHasKey,
  setRunHandle,
  setSmallMaze,
  step,
  stop,
  turnLeft,
  turnRight
} from "./actions";
import Maze, { Direction, leftOf, Location, move, rightOf } from "../maze/maze";
import { Action, AnyAction } from "redux";
import { Script } from "../script/types";
import scriptReducers from "../script/reducers";
import { getFirstStepId } from "../script/selectors";
import { RunnerState } from "./types";
import { getMaze, getNextStepId, isCrashed, onKey } from "./selectors";
import { DeepImmutableObject } from "deox/dist/types";
import { Omit } from "react-redux";

export const addMaze = (state: Omit<RunnerState, "maze">): RunnerState => ({
  ...state,
  maze: new Maze({
    width: state.smallMaze ? state.smallMazeSize : state.mazeSize,
    addDoor: state.addDoor,
    randomSeed: state.randomSeed
  })
});

export const buildInitialState = (
  modelState: {
    location?: Location;
    facing?: Direction;
    error?: string;
    maze?: Maze;
    script: Script;
    smallMaze?: boolean;
    smallMazeSize?: number;
    mazeSize?: number;
    addDoor?: boolean;
    randomSeed?: string;
  } = { script: [] }
): RunnerState => {
  const {
    script,
    smallMaze = false,
    smallMazeSize = 3,
    mazeSize = 6,
    addDoor = false,
    randomSeed = Math.random() + "y"
  } = modelState;
  const location = modelState.location || { x: 0, y: 0 };
  const facing = modelState.facing || Direction.RIGHT;
  const error = modelState.error;

  return addMaze({
    location,
    facing,
    error,
    currStepId: getFirstStepId(script),
    script,
    hasKey: false,
    doorOpen: false,
    variables: { hasKey: false },
    running: false,
    movements: 0,
    smallMaze,
    smallMazeSize,
    mazeSize,
    addDoor,
    randomSeed
  });
};

export const initialState = buildInitialState();

/**
 * Wraps a reducer so that it ignores any actions if the runner has crashed
 */
const ignoreIfCrashed = <A extends Action>(
  reducer: (state: RunnerState, action: A) => RunnerState
) => (state: RunnerState, action: A) =>
  isCrashed(state) ? state : reducer(state, action);

const runnerReducer = createReducer(initialState, handle => [
  handle(reset, state => {
    return resetState(state);
  }),
  handle(run, state => ({ ...state, running: true })),
  handle(stop, state => ({ ...state, running: false })),
  handle(setRunHandle, (state, { payload: runHandle }) => ({
    ...state,
    runHandle
  })),
  handle(newMaze, state => buildNewMaze(state)),
  handle(setSmallMaze, (state, { payload: smallMaze }) =>
    resetState({ ...state, smallMaze })
  ),
  handle(
    moveForward,
    ignoreIfCrashed(state => {
      if (state.maze.hasWall(state.location, state.facing)) {
        return { ...state, error: "Crashed into a wall" };
      } else if (
        state.maze.hasDoor(state.location, state.facing) &&
        !state.doorOpen
      ) {
        return { ...state, error: "Attempted to go through a closed door" };
      } else {
        return {
          ...state,
          location: move(state.location, state.facing),
          movements: state.movements + 1
        };
      }
    })
  ),
  handle(
    turnLeft,
    ignoreIfCrashed(state => ({ ...state, facing: leftOf(state.facing) }))
  ),
  handle(
    turnRight,
    ignoreIfCrashed(state => ({ ...state, facing: rightOf(state.facing) }))
  ),
  handle(
    step,
    ignoreIfCrashed(state => ({ ...state, currStepId: getNextStepId(state) }))
  ),
  handle(
    grabKey,
    ignoreIfCrashed(state => {
      if (onKey(state) && !state.hasKey) {
        return { ...state, hasKey: true };
      } else {
        return { ...state, error: "There is no key here" };
      }
    })
  ),
  handle(
    openDoor,
    ignoreIfCrashed(state => {
      if (!getMaze(state).hasDoor(state.location, state.facing)) {
        return { ...state, error: "There is no door here" };
      } else if (!state.hasKey) {
        return { ...state, error: "You don't have the key" };
      } else if (state.doorOpen) {
        return { ...state, error: "The door is already open" };
      } else {
        return { ...state, doorOpen: true };
      }
    })
  ),
  handle(
    setHasKey,
    ignoreIfCrashed(state => ({
      ...state,
      variables: { ...state.variables, hasKey: true }
    }))
  ),
  handle(
    clearHasKey,
    ignoreIfCrashed(state => ({
      ...state,
      variables: { ...state.variables, hasKey: false }
    }))
  )
]);

export const resetState = (state: RunnerState & { maze?: Maze }) =>
  addMaze({
    ...state,
    currStepId: getFirstStepId(state.script),
    location: initialState.location,
    facing: initialState.facing,
    hasKey: initialState.hasKey,
    doorOpen: initialState.doorOpen,
    variables: initialState.variables,
    running: initialState.running,
    error: initialState.error
  });

export const buildNewMaze = (state: RunnerState) =>
  addMaze({ ...state, randomSeed: Math.random() + "x" });

const reducer = (
  state: RunnerState | DeepImmutableObject<RunnerState> | undefined,
  action: AnyAction
) => {
  state = runnerReducer(state, action);
  const script = scriptReducers(state.script, action as any);

  if (script !== (state && state.script)) {
    state = resetState({ ...state, script });
  }

  return state;
};

export default reducer;
