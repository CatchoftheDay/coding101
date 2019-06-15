import { RunnerState } from "./services/runner/types";

export enum Stage {
  ACTIONS_ONLY = 1,
  CONTROL = 2
}

export interface TutorialState {
  stage: Stage;
  runner: RunnerState;
}
