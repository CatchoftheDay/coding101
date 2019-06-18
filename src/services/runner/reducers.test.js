import { applyMiddleware, createStore } from "redux";
import Maze, { Direction } from "../maze/maze";
import { mazeRunner } from "../script/constants";
import {
  grabKey,
  moveForward,
  openDoor,
  step,
  turnLeft,
  turnRight
} from "./actions";
import { executeActions } from "./middleware";
import reducer, {
  initialState as reducerInitialState,
  resetState
} from "./reducers";
import {
  isCrashed,
  getFacing,
  getLocation,
  isAtFinish,
  onKey,
  isDone,
  getCurrentStepId
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

    expect(isCrashed(newState)).toEqual(false);
    expect(getLocation(newState).x).toEqual(1);
    expect(getLocation(newState).y).toEqual(0);
  });

  it("Should detect collisions", () => {
    const newState = reducer(
      { ...initialState, facing: Direction.UP },
      moveForward()
    );

    expect(isCrashed(newState)).toEqual(true);
    expect(getFacing(newState)).toEqual(Direction.UP);
    expect(getLocation(newState)).toEqual(getLocation(initialState));
  });

  it("Should not move or turn after a collision", () => {
    const crashedState = {
      ...initialState,
      error: "There's a wall in the way"
    };

    expect(reducer(crashedState, turnLeft())).toEqual(crashedState);
    expect(reducer(crashedState, turnRight())).toEqual(crashedState);
    expect(reducer(crashedState, moveForward())).toEqual(crashedState);
  });

  it("Should be able to solve the maze", () => {
    const store = createStore(
      reducer,
      resetState({ ...initialState, script: mazeRunner }),
      applyMiddleware(executeActions())
    );
    const { maze } = store.getState();
    const maxSteps = maze.height * maze.width * 20;

    let stepNum = 0;

    while (
      stepNum < maxSteps &&
      !isCrashed(store.getState()) &&
      !isAtFinish(store.getState())
    ) {
      stepNum++;
      store.dispatch(step());
    }

    expect(isAtFinish(store.getState())).toEqual(true);
    expect(isCrashed(store.getState())).toEqual(false);
  });

  it("Should not be able to pick up key if not there", () => {
    const maze = new Maze({ width: 2, addDoor: true });
    const store = createStore(
      reducer,
      resetState({ ...initialState, maze, location: maze.doorLocation }),
      applyMiddleware(executeActions())
    );

    expect(onKey(store.getState())).toBeFalsy();
    store.dispatch(grabKey());
    expect(isCrashed(store.getState())).toBeTruthy();
  });

  it("Should not be able to open door if not there", () => {
    const maze = new Maze({ width: 2, addDoor: true });
    const store = createStore(
      reducer,
      resetState({ ...initialState, maze, location: maze.doorLocation }),
      applyMiddleware(executeActions())
    );

    store.dispatch(openDoor());
    expect(isCrashed(store.getState())).toBeTruthy();
  });

  it("Should not be able to walk through closed doors", () => {
    const mazeProps = { width: 2, addDoor: true, randomSeed: "seed" };
    const maze = new Maze(mazeProps);
    let facing;
    if (maze.hasDoor(maze.doorLocation, Direction.LEFT)) {
      facing = Direction.LEFT;
    } else {
      facing = Direction.UP;
    }

    const store = createStore(
      reducer,
      resetState({
        ...initialState,
        ...mazeProps,
        location: maze.doorLocation,
        facing
      }),
      applyMiddleware(executeActions())
    );
    store.dispatch(moveForward());
    expect(isCrashed(store.getState())).toBeTruthy();
  });

  it("Should proceed from if statements correctly", function() {
    const script = [
      {
        id: 1,
        type: "branch",
        conditions: [{ id: 10, type: "conditional", conditions: [], steps: [] }]
      },
      {
        id: 2,
        type: "branch",
        conditions: [
          {
            id: 20,
            type: "conditional",
            conditions: [],
            steps: [{ id: 21, type: "action", action: "moveForward" }]
          }
        ]
      }
    ];
    const store = createStore(
      reducer,
      resetState({ ...initialState, script }),
      applyMiddleware(executeActions())
    );
    const visited = [];

    while (!isDone(store.getState())) {
      visited.push(getCurrentStepId(store.getState()));
      store.dispatch(step());
    }

    expect(visited).toEqual([10, 20, 21]);
  });
});
