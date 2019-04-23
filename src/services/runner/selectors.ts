import { RunnerState } from "./reducer";

export const crashedSelector = (state: RunnerState) => state.crashed;
export const locationSelector = (state: RunnerState) => state.location;
export const facingSelector = (state: RunnerState) => state.facing;
export const mazeSelector = (state: RunnerState) => state.maze;
