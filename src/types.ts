import { RunnerState } from "./services/runner/types";

export enum Stage {
  ACTIONS = 1,
  CONTROL = 2,
  VARIABLES = 3
}

export interface TutorialState {
  stage: Stage;
  runner: RunnerState;
  keystrokes: string;
}
