import { Script } from "./types";
import {
  AT_FINISH,
  WALL_IN_FRONT,
  WALL_ON_LEFT,
  MOVE_FORWARD,
  TURN_LEFT,
  TURN_RIGHT
} from "../../constants";

export const mazeRunner: Script = [
  {
    id: 1000,
    type: "while",
    condition: "!" + AT_FINISH,
    steps: [
      {
        id: 1100,
        type: "branch",
        conditions: [
          {
            id: 1110,
            type: "conditional",
            condition: "!" + WALL_ON_LEFT,
            steps: [
              { id: 1111, type: "action", action: TURN_LEFT },
              { id: 1112, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1120,
            type: "conditional",
            condition: "!" + WALL_IN_FRONT,
            steps: [{ id: 1121, type: "action", action: MOVE_FORWARD }]
          },
          {
            id: 1130,
            type: "conditional",
            condition: null,
            steps: [{ id: 1131, type: "action", action: TURN_RIGHT }]
          }
        ]
      }
    ]
  }
];

export const ItemTypes = {
  CONDITION: "condition",
  STEP: "step"
};
