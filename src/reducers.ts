import { AnyAction, combineReducers } from "redux";
import { createReducer } from "deox";
import runnerReducer from "./services/runner/reducers";
import { Stage, TutorialState } from "./types";
import { addKey, advanceTo } from "./actions";
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

const baseReducers = combineReducers({
  runner: runnerReducer,
  stage: stageReducer,
  keystrokes: keystrokeReducer
});

const reducers = (state: TutorialState | undefined, action: AnyAction) => {
  const oldStage = state && state.stage;
  state = baseReducers(state, action);

  if (state.stage !== oldStage) {
    state = {
      ...state,
      runner: { ...state.runner, maze: new Maze(mazePropsByState[state.stage]) }
    };
  }

  return state;
};

export const initialState = reducers(undefined, { type: null });
export default reducers;
