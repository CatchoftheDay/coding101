import { Stage } from "./types";

export const TURN_LEFT = "turnLeft";
export const TURN_RIGHT = "turnRight";
export const MOVE_FORWARD = "moveForward";

export const AT_FINISH = "atFinish";
export const WALL_ON_LEFT = "wallOnLeft";
export const WALL_IN_FRONT = "wallInFront";
export const WALL_ON_RIGHT = "wallOnRight";

export const actions = [
  { id: TURN_LEFT, label: "Turn left", stage: Stage.ACTIONS_ONLY },
  { id: TURN_RIGHT, label: "Turn right", stage: Stage.ACTIONS_ONLY },
  { id: MOVE_FORWARD, label: "Move forward", stage: Stage.ACTIONS_ONLY }
];
export const conditions = [
  { id: AT_FINISH, label: "At finish", stage: Stage.CONTROL },
  { id: WALL_ON_LEFT, label: "Wall on left", stage: Stage.CONTROL },
  { id: WALL_IN_FRONT, label: "Wall in front", stage: Stage.CONTROL },
  { id: WALL_ON_RIGHT, label: "Wall on right", stage: Stage.CONTROL }
];
export const controls = [
  { id: "branch", label: "If ... then ...", stage: Stage.CONTROL },
  { id: "while", label: "While ... do ...", stage: Stage.CONTROL }
];
