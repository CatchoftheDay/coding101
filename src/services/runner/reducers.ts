import { createReducer } from "deox";
import { moveForward, reset, step, turnLeft, turnRight } from "./actions";
import Maze, { Direction, leftOf, Location, move, rightOf } from "../maze/maze";
import { Action } from "redux";
import { Script } from "../script/types";
import { getFirstStepId } from "../script/selectors";
import { RunnerState } from "./types";
import { mazeRunner } from "../script/constants";
import { getNextStepId } from "./selectors";

export const buildInitialState = (
  modelState: {
    location?: Location;
    facing?: Direction;
    crashed?: boolean;
    maze?: Maze;
    script: Script;
  } = { script: mazeRunner }
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
    script
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

const reducer = createReducer(initialState, handle => [
  handle(reset, state => {
    const { script, maze } = state;

    return {
      ...initialState,
      maze,
      script,
      currStepId: getFirstStepId(script)
    };
  }),
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
  )
]);

export default reducer;
