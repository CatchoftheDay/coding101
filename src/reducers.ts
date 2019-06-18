import { AnyAction, combineReducers } from "redux";
import { createReducer } from "deox";
import runnerReducer, { resetState } from "./services/runner/reducers";
import { Stage, TutorialState } from "./types";
import { addAchievement, addKey, advanceTo } from "./actions";
import Maze from "./services/maze/maze";

const mazePropsByState = {
  [Stage.ACTIONS]: { width: 4, addDoor: false, randomSeed: "hello" },
  [Stage.CONTROL]: { width: 6, addDoor: false },
  [Stage.VARIABLES]: { width: 6, addDoor: true, randomSeed: "catch" }
};

const stageReducer = createReducer(Stage.ACTIONS, handle => [
  handle(advanceTo, (currStage, { payload: newStage }) =>
    Math.max(currStage, newStage)
  )
]);

const keystrokeReducer = createReducer("", handle => [
  handle(
    addKey,
    (enteredSoFar, { payload: char }) => enteredSoFar.substr(-15) + char
  )
]);

const achievementReducer = createReducer([] as string[], handle => [
  handle(addAchievement, (achievements, { payload: achievement }) => {
    if (achievements.indexOf(achievement) === -1) {
      return [...achievements, achievement];
    } else {
      return achievements;
    }
  })
]);

const baseReducers = combineReducers({
  runner: runnerReducer,
  stage: stageReducer,
  keystrokes: keystrokeReducer,
  achievements: achievementReducer
});

const reducers = (state: TutorialState | undefined, action: AnyAction) => {
  const oldStage = state && state.stage;
  state = baseReducers(state, action) as TutorialState;

  if (state.stage !== oldStage) {
    state = {
      ...state,
      runner: resetState({
        ...state.runner,
        maze: new Maze(mazePropsByState[state.stage])
      })
    };
  }

  return state;
};

export const initialState = reducers(undefined, { type: null });
export default reducers;
