import { createReducer } from "deox";
import { moveForward, reset, turnLeft, turnRight } from "./actions";
import Maze, { Direction, leftOf, Location, move, rightOf } from "../maze/maze";
import { Action } from "redux";

export interface RunnerState {
  maze: Maze;
  location: Location;
  facing: Direction;
  crashed: boolean;
}

export const initialState: RunnerState = {
  maze: new Maze({ width: 5 }),
  location: { x: 0, y: 0 },
  facing: Direction.LEFT,
  crashed: false
};

/**
 * Wraps a reducer so that it ignores any actions if the runner has crashed
 */
const ignoreIfCrashed = <A extends Action>(
  reducer: (state: RunnerState, action: A) => RunnerState
) => (state: RunnerState, action: A) =>
  state.crashed ? state : reducer(state, action);

const reducer = createReducer(initialState, handle => [
  handle(reset, state => ({ ...initialState, maze: state.maze })),
  handle(
    moveForward,
    ignoreIfCrashed(state => {
      switch (true) {
        case state.maze.hasWall(state.location, state.facing):
          return { ...state, crashed: true };
        default:
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
  )
]);

export default reducer;
