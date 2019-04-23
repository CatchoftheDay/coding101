import { Direction } from "../maze/maze";
import { moveForward, turnLeft, turnRight } from "./actions";
import reducer, { initialState as reducerInitialState } from "./reducer";
import Maze from "../maze/maze";
import { crashedSelector, facingSelector, locationSelector } from "./selectors";

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
        facingSelector(reducer({ ...initialState, facing }, actionCreator()))
      ).toEqual(expected)
    );
  });

  it("Should be able to move forward", () => {
    const newState = reducer(
      { ...initialState, facing: Direction.RIGHT },
      moveForward()
    );

    expect(crashedSelector(newState)).toEqual(false);
    expect(locationSelector(newState).x).toEqual(1);
    expect(locationSelector(newState).y).toEqual(0);
  });

  it("Should detect collisions", () => {
    const newState = reducer(
      { ...initialState, facing: Direction.UP },
      moveForward()
    );

    expect(crashedSelector(newState)).toEqual(true);
    expect(facingSelector(newState)).toEqual(Direction.UP);
    expect(locationSelector(newState)).toEqual(locationSelector(initialState));
  });

  it("Should not move or turn after a collision", () => {
    const crashedState = { ...initialState, crashed: true };

    expect(reducer(crashedState, turnLeft())).toEqual(crashedState);
    expect(reducer(crashedState, turnRight())).toEqual(crashedState);
    expect(reducer(crashedState, moveForward())).toEqual(crashedState);
  });
});
