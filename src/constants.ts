import { Stage } from "./types";

export const TURN_LEFT = "turnLeft";
export const TURN_RIGHT = "turnRight";
export const MOVE_FORWARD = "moveForward";

export const AT_FINISH = "atFinish";
export const CAN_MOVE_LEFT = "canMoveLeft";
export const CAN_MOVE_FORWARD = "canMoveForward";
export const CAN_MOVE_RIGHT = "canMoveRight";

export const actions = [
  { id: TURN_LEFT, label: "Turn left", stage: Stage.ACTIONS_ONLY },
  { id: TURN_RIGHT, label: "Turn right", stage: Stage.ACTIONS_ONLY },
  { id: MOVE_FORWARD, label: "Move forward", stage: Stage.ACTIONS_ONLY }
];
export const conditions = [
  { id: AT_FINISH, label: "At finish", stage: Stage.CONTROL },
  { id: CAN_MOVE_LEFT, label: "Can move left", stage: Stage.CONTROL },
  { id: CAN_MOVE_FORWARD, label: "Can move forward", stage: Stage.CONTROL },
  { id: CAN_MOVE_RIGHT, label: "Can move right", stage: Stage.CONTROL }
];
export const controls = [
  { id: "branch", label: "If ... then ...", stage: Stage.CONTROL },
  { id: "while", label: "While ... do ...", stage: Stage.CONTROL }
];
