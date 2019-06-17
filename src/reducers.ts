import { combineReducers } from "redux";
import { createReducer } from "deox";
import runnerReducer from "./services/runner/reducers";
import { Stage } from "./types";
import { addKey, advanceTo } from "./actions";

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

const reducers = combineReducers({
  runner: runnerReducer,
  stage: stageReducer,
  keystrokes: keystrokeReducer
});

export const initialState = reducers(undefined, { type: null });
export default reducers;
