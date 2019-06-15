import { combineReducers } from "redux";
import runnerReducer from "./services/runner/reducers";
import { Stage } from "./types";
import { createReducer } from "deox";
import { advanceTo } from "./actions";

const stageReducer = createReducer(Stage.ACTIONS_ONLY, handle => [
  handle(advanceTo, (currStage, { payload: newStage }) =>
    Math.max(currStage, newStage)
  )
]);

const reducers = combineReducers({
  runner: runnerReducer,
  stage: stageReducer
});

export const initialState = reducers(undefined, { type: null });
export default reducers;
