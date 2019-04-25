import { BaseRunnerState, RunnerState } from "./reducer";
import { createSelector } from "reselect";

export const getCrashed = (state: BaseRunnerState) => state.crashed;
export const getLocation = (state: BaseRunnerState) => state.location;
export const getFacing = (state: BaseRunnerState) => state.facing;
export const getMaze = (state: RunnerState) => state.maze;

export const getDisplayedState = (state: RunnerState) => state.displayed;
export const getDisplayedCrashed = createSelector(
  getDisplayedState,
  getCrashed
);
export const getDisplayedLocation = createSelector(
  getDisplayedState,
  getLocation
);
export const getDisplayedFacing = createSelector(
  getDisplayedState,
  getFacing
);
