import { createReducer } from "deox";
import {
  clearHasKey,
  grabKey,
  moveForward,
  newMaze,
  openDoor,
  reset,
  setHasKey,
  step,
  turnLeft,
  turnRight
} from "./actions";
import Maze, { Direction, leftOf, Location, move, rightOf } from "../maze/maze";
import { Action, AnyAction } from "redux";
import { Script } from "../script/types";
import scriptReducers from "../script/reducers";
import { getFirstStepId } from "../script/selectors";
import { RunnerState } from "./types";
import { getMaze, getNextStepId, onKey } from "./selectors";
import { DeepImmutableObject } from "deox/dist/types";

export const buildInitialState = (
  modelState: {
    location?: Location;
    facing?: Direction;
    crashed?: boolean;
    maze?: Maze;
    script: Script;
  } = { script: [] }
): RunnerState => {
  const { script } = modelState;
  const location = modelState.location || { x: 0, y: 0 };
  const facing = modelState.facing || Direction.RIGHT;
  const crashed = modelState.crashed == null ? false : modelState.crashed;
  const maze = modelState.maze || new Maze({ width: 5 });

  return {
    maze,
    location,
    facing,
    crashed,
    currStepId: getFirstStepId(script),
    script,
    hasKey: false,
    doorOpen: false,
    variables: { hasKey: false }
  };
};

export const initialState = buildInitialState();

/**
 * Wraps a reducer so that it ignores any actions if the runner has crashed
 */
const ignoreIfCrashed = <A extends Action>(
  reducer: (state: RunnerState, action: A) => RunnerState
) => (state: RunnerState, action: A) =>
  state.crashed ? state : reducer(state, action);

const runnerReducer = createReducer(initialState, handle => [
  handle(reset, state => {
    return resetState(state);
  }),
  handle(newMaze, state =>
    resetState({
      ...state,
      maze: new Maze({
        width: state.maze.width,
        randomSeed: Math.random() + ""
      })
    })
  ),
  handle(
    moveForward,
    ignoreIfCrashed(state => {
      if (state.maze.hasWall(state.location, state.facing)) {
        return { ...state, crashed: true };
      } else {
        return { ...state, location: move(state.location, state.facing) };
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
        return { ...state, crashed: true };
      }
    })
  ),
  handle(
    openDoor,
    ignoreIfCrashed(state => {
      if (
        state.hasKey &&
        !state.doorOpen &&
        getMaze(state).hasDoor(state.location, state.facing)
      ) {
        return { ...state, doorOpen: true };
      } else {
        return { ...state, crashed: true };
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

export const resetState = ({ script, maze }: RunnerState) => ({
  ...initialState,
  maze,
  script,
  currStepId: getFirstStepId(script)
});

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
