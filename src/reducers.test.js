import { applyMiddleware, createStore } from "redux";
import Maze from "./services/maze/maze";
import { mazeRunner } from "./services/script/constants";
import { checkAchievements } from "./middleware";
import { executeActions } from "./services/runner/middleware";
import { step } from "./services/runner/actions";
import reducer, { initialState as reducerInitialState } from "./reducers";
import { getRunner } from "./selectors";
import achievements from "./achievements";
import { hasAchievement } from "./selectors";
import {
  getMaze,
  isAtFinish,
  isCrashed,
  isDone
} from "./services/runner/selectors";
import { resetState } from "./services/runner/reducers";

const initialState = {
  ...reducerInitialState,
  runner: resetState({
    ...reducerInitialState.runner,
    script: mazeRunner,
    maze: new Maze({ width: 5, addDoor: true })
  })
};

describe("Tutorial reducers", () => {
  it("Should be able to get all the achievements", () => {
    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(executeActions(getRunner), checkAchievements)
    );
    const maze = getMaze(getRunner(store.getState()));
    const maxSteps = maze.height * maze.width * 20;

    let stepNum = 0;

    while (
      stepNum < maxSteps &&
      !isCrashed(getRunner(store.getState())) &&
      !isDone(getRunner(store.getState()))
    ) {
      stepNum++;
      store.dispatch(step());
    }

    expect(isAtFinish(getRunner(store.getState()))).toEqual(true);
    expect(isCrashed(getRunner(store.getState()))).toEqual(false);

    const missedAchievements = achievements
      .filter(achievement => !hasAchievement(store.getState(), achievement.id))
      .map(({ id }) => id);
    expect(missedAchievements).toEqual(["timeToDebug"]);
  });
});
