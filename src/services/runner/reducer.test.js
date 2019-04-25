import { Direction } from "../maze/maze";
import {
  moveForward,
  startNextAnimation,
  turnLeft,
  turnRight
} from "./actions";
import reducer, { initialState as reducerInitialState } from "./reducer";
import Maze from "../maze/maze";
import {
  getCrashed,
  getDisplayedCrashed,
  getDisplayedFacing,
  getDisplayedLocation,
  getFacing,
  getLocation
} from "./selectors";

const initialState = {
  ...reducerInitialState,
  facing: Direction.RIGHT,
  maze: new Maze({ width: 5, randomSeed: "can move right from (0, 0)" })
};

describe("Runner reducers", () => {
  it("Should turn correctly", () => {
    const tests = [
      {
        actionCreator: turnLeft,
        facing: Direction.UP,
        expected: Direction.LEFT
      },
      {
        actionCreator: turnLeft,
        facing: Direction.LEFT,
        expected: Direction.DOWN
      },
      {
        actionCreator: turnLeft,
        facing: Direction.DOWN,
        expected: Direction.RIGHT
      },
      {
        actionCreator: turnLeft,
        facing: Direction.RIGHT,
        expected: Direction.UP
      },
      {
        actionCreator: turnRight,
        facing: Direction.UP,
        expected: Direction.RIGHT
      },
      {
        actionCreator: turnRight,
        facing: Direction.RIGHT,
        expected: Direction.DOWN
      },
      {
        actionCreator: turnRight,
        facing: Direction.DOWN,
        expected: Direction.LEFT
      },
      {
        actionCreator: turnRight,
        facing: Direction.LEFT,
        expected: Direction.UP
      }
    ];

    tests.forEach(({ actionCreator, facing, expected }) =>
      expect(
        getFacing(reducer({ ...initialState, facing }, actionCreator()))
      ).toEqual(expected)
    );
  });

  it("Should be able to move forward", () => {
    const newState = reducer(
      { ...initialState, facing: Direction.RIGHT },
      moveForward()
    );

    expect(getCrashed(newState)).toEqual(false);
    expect(getLocation(newState).x).toEqual(1);
    expect(getLocation(newState).y).toEqual(0);
  });

  it("Should detect collisions", () => {
    const newState = reducer(
      { ...initialState, facing: Direction.UP },
      moveForward()
    );

    expect(getCrashed(newState)).toEqual(true);
    expect(getFacing(newState)).toEqual(Direction.UP);
    expect(getLocation(newState)).toEqual(getLocation(initialState));
  });

  it("Should not move or turn after a collision", () => {
    const crashedState = { ...initialState, crashed: true };

    expect(reducer(crashedState, turnLeft())).toEqual(crashedState);
    expect(reducer(crashedState, turnRight())).toEqual(crashedState);
    expect(reducer(crashedState, moveForward())).toEqual(crashedState);
  });

  it("Should set the displayed state immediately if there are no pending animations", () => {
    const newState = reducer(initialState, turnRight());

    expect(getDisplayedCrashed(newState)).toEqual(false);
    expect(getDisplayedFacing(newState)).toEqual(Direction.DOWN);
    expect(getDisplayedLocation(newState)).toEqual({ x: 0, y: 0 });
  });

  it("Should not set the displayed state immediately if there are pending animations", () => {
    const newState = reducer(reducer(initialState, turnRight()), turnRight());

    // Should match the result of the first turnRight(), because the first
    // 'animation' hasn't completed yet
    expect(getDisplayedCrashed(newState)).toEqual(false);
    expect(getDisplayedFacing(newState)).toEqual(Direction.DOWN);
    expect(getDisplayedLocation(newState)).toEqual({ x: 0, y: 0 });
  });

  it("Should set the displayed state to the next state when each animation completes", () => {
    const preAnimationCompleteState = reducer(
      reducer(initialState, turnRight()),
      turnRight()
    );
    const animationCompleteState = reducer(
      preAnimationCompleteState,
      startNextAnimation()
    );

    expect(getDisplayedCrashed(animationCompleteState)).toEqual(false);
    expect(getDisplayedFacing(animationCompleteState)).toEqual(Direction.LEFT);
    expect(getDisplayedLocation(animationCompleteState)).toEqual({
      x: 0,
      y: 0
    });
  });
});
