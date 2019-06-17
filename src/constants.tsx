import React from "react";
import { Stage } from "./types";

export const TURN_LEFT = "turnLeft";
export const TURN_RIGHT = "turnRight";
export const MOVE_FORWARD = "moveForward";
export const GRAB_KEY = "grabKey";
export const OPEN_DOOR = "openDoor";
export const SET_HAS_KEY = "setHasKey";
export const CLEAR_HAS_KEY = "clearHasKey";

export const AT_FINISH = "atFinish";
export const WALL_ON_LEFT = "wallOnLeft";
export const WALL_IN_FRONT = "wallInFront";
export const WALL_ON_RIGHT = "wallOnRight";
export const DOOR_ON_LEFT = "doorOnLeft";
export const DOOR_IN_FRONT = "doorInFront";
export const DOOR_ON_RIGHT = "doorOnRight";
export const ON_KEY = "onKey";
export const HAS_KEY_SET = "hasKeySet";

export const actions = [
  { id: TURN_LEFT, label: "Turn left", stage: Stage.ACTIONS },
  { id: TURN_RIGHT, label: "Turn right", stage: Stage.ACTIONS },
  { id: MOVE_FORWARD, label: "Move forward", stage: Stage.ACTIONS },
  { id: GRAB_KEY, label: "Grab key", stage: Stage.VARIABLES },
  { id: OPEN_DOOR, label: "Open door", stage: Stage.VARIABLES },
  {
    id: SET_HAS_KEY,
    label: (
      <>
        Set <code>hasKey</code>
      </>
    ),
    stage: Stage.VARIABLES
  },
  {
    id: CLEAR_HAS_KEY,
    label: (
      <>
        Clear <code>hasKey</code>
      </>
    ),
    stage: Stage.VARIABLES
  }
];
export const conditions = [
  { id: AT_FINISH, label: "At finish", stage: Stage.CONTROL },
  { id: WALL_ON_LEFT, label: "Wall on left", stage: Stage.CONTROL },
  { id: WALL_IN_FRONT, label: "Wall in front", stage: Stage.CONTROL },
  { id: WALL_ON_RIGHT, label: "Wall on right", stage: Stage.CONTROL },
  { id: DOOR_ON_LEFT, label: "Door on left", stage: Stage.VARIABLES },
  { id: DOOR_IN_FRONT, label: "Door in front", stage: Stage.VARIABLES },
  { id: DOOR_ON_RIGHT, label: "Door on right", stage: Stage.VARIABLES },
  { id: ON_KEY, label: "On top of key", stage: Stage.VARIABLES },
  {
    id: HAS_KEY_SET,
    label: (
      <>
        <code>hasKey</code> is set
      </>
    ),
    stage: Stage.VARIABLES
  }
];
export const controls = [
  { id: "branch", label: "If ... then ...", stage: Stage.CONTROL },
  { id: "while", label: "While ... do ...", stage: Stage.CONTROL }
];
