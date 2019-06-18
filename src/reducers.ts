import { AnyAction, combineReducers } from "redux";
import { createReducer } from "deox";
import runnerReducer, { addMaze, resetState } from "./services/runner/reducers";
import { Stage, TutorialState } from "./types";
import { addAchievement, addKey, advanceTo } from "./actions";

const mazePropsByState = {
  [Stage.ACTIONS]: {
    addDoor: false,
    mazeSize: 4,
    smallMaze: false,
    randomSeed: "hello"
  },
  [Stage.CONTROL]: {
    addDoor: false,
    mazeSize: 6,
    smallMaze: false,
    randomSeed: "Hi there"
  },
  [Stage.VARIABLES]: {
    addDoor: true,
    mazeSize: 6,
    smallMaze: false,
    randomSeed: "maze"
  }
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
      runner: resetState(
        addMaze({
          ...state.runner,
          ...mazePropsByState[state.stage]
        })
      )
    };
  }

  return state;
};

export const initialState = reducers(undefined, { type: null });
export default reducers;
