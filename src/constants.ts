import { Stage } from "./types";

export const actions = [
  { step: "turnLeft", stage: Stage.ACTIONS_ONLY },
  { step: "turnRight", stage: Stage.ACTIONS_ONLY },
  { step: "moveForward", stage: Stage.ACTIONS_ONLY }
];
export const conditions = [
  { step: "atFinish", stage: Stage.CONTROL },
  { step: "canMoveLeft", stage: Stage.CONTROL },
  { step: "canMoveForward", stage: Stage.CONTROL },
  { step: "canMoveRight", stage: Stage.CONTROL }
];
export const controls = [
  { step: "branch", stage: Stage.CONTROL },
  { step: "while", stage: Stage.CONTROL }
];
