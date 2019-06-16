import { Stage } from "./types";

export const actions = [
  { id: "turnLeft", label: "Turn left", stage: Stage.ACTIONS_ONLY },
  { id: "turnRight", label: "Turn right", stage: Stage.ACTIONS_ONLY },
  { id: "moveForward", label: "Move forward", stage: Stage.ACTIONS_ONLY }
];
export const conditions = [
  { id: "atFinish", label: "At finish", stage: Stage.CONTROL },
  { id: "canMoveLeft", label: "Can move left", stage: Stage.CONTROL },
  { id: "canMoveForward", label: "Can move forward", stage: Stage.CONTROL },
  { id: "canMoveRight", label: "Can move right", stage: Stage.CONTROL }
];
export const controls = [
  { id: "branch", label: "If ... then ...", stage: Stage.CONTROL },
  { id: "while", label: "While ... do ...", stage: Stage.CONTROL }
];
