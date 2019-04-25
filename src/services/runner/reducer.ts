import { createReducer } from "deox";
import {
  moveForward,
  reset,
  startNextAnimation,
  turnLeft,
  turnRight
} from "./actions";
import Maze, { Direction, leftOf, Location, move, rightOf } from "../maze/maze";
import { Action } from "redux";
import produce from "immer";

export interface BaseRunnerState {
  location: Location;
  facing: Direction;
  crashed: boolean;
}

export interface DisplayedRunnerState extends BaseRunnerState {
  remainingAnimationSteps: ReadonlyArray<BaseRunnerState>;
}

export interface RunnerState extends BaseRunnerState {
  maze: Maze;
  displayed: DisplayedRunnerState;
}

export const buildInitialState = (
  modelState: {
    location?: Location;
    facing?: Direction;
    crashed?: boolean;
    maze?: Maze;
  } = {}
): RunnerState => {
  const location = modelState.location || { x: 0, y: 0 };
  const facing = modelState.facing || Direction.RIGHT;
  const crashed = modelState.crashed == null ? false : modelState.crashed;
  const maze = modelState.maze || new Maze({ width: 5 });

  return {
    maze,
    location,
    facing,
    crashed,
    displayed: {
      remainingAnimationSteps: [],
      location,
      facing,
      crashed
    }
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

const addAnimationStep = <A extends Action>(
  reducer: (state: RunnerState, action: A) => RunnerState
) => (state: RunnerState, action: A) => {
  return produce(reducer(state, action), draftState => {
    const displayed = draftState.displayed;

    // Add this change to the list of changes to be animated
    displayed.remainingAnimationSteps = displayed.remainingAnimationSteps.concat(
      {
        location: draftState.location,
        facing: draftState.facing,
        crashed: draftState.crashed
      }
    );

    // If there are no active animations, start one
    if (displayed.remainingAnimationSteps.length === 1) {
      Object.assign(displayed, displayed.remainingAnimationSteps[0]);
    }
  });
};

const reducer = createReducer(initialState, handle => [
  handle(reset, state => ({ ...initialState, maze: state.maze })),
  handle(
    moveForward,
    ignoreIfCrashed(
      addAnimationStep(state => {
        switch (true) {
          case state.maze.hasWall(state.location, state.facing):
            return { ...state, crashed: true };
          default:
            return { ...state, location: move(state.location, state.facing) };
        }
      })
    )
  ),
  handle(
    turnLeft,
    ignoreIfCrashed(
      addAnimationStep(state => ({ ...state, facing: leftOf(state.facing) }))
    )
  ),
  handle(
    turnRight,
    ignoreIfCrashed(
      addAnimationStep(state => ({ ...state, facing: rightOf(state.facing) }))
    )
  ),
  handle(
    startNextAnimation,
    produce(draftState => {
      const displayed = draftState.displayed;

      displayed.remainingAnimationSteps = displayed.remainingAnimationSteps.slice(
        1
      );

      if (displayed.remainingAnimationSteps.length) {
        Object.assign(displayed, displayed.remainingAnimationSteps[0]);
      }
    })
  )
]);

export default reducer;
