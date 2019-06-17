import { Script } from "./types";
import {
  AT_FINISH,
  WALL_IN_FRONT,
  WALL_ON_LEFT,
  MOVE_FORWARD,
  TURN_LEFT,
  TURN_RIGHT,
  HAS_KEY_SET,
  DOOR_IN_FRONT,
  OPEN_DOOR,
  ON_KEY,
  GRAB_KEY,
  SET_HAS_KEY
} from "../../constants";

export const mazeRunner: Script = [
  {
    id: 1000,
    type: "while",
    conditions: ["!" + AT_FINISH],
    steps: [
      {
        id: 1100,
        type: "branch",
        conditions: [
          {
            id: 1110,
            type: "conditional",
            conditions: [ON_KEY],
            steps: [
              {
                id: 1111,
                type: "action",
                action: GRAB_KEY
              },
              {
                id: 1112,
                type: "action",
                action: SET_HAS_KEY
              }
            ]
          }
        ]
      },
      {
        id: 1200,
        type: "branch",
        conditions: [
          {
            id: 1210,
            type: "conditional",
            conditions: ["!" + WALL_ON_LEFT],
            steps: [
              { id: 1211, type: "action", action: TURN_LEFT },
              {
                id: 1212,
                type: "branch",
                conditions: [
                  {
                    id: 12121,
                    type: "conditional",
                    conditions: [HAS_KEY_SET, DOOR_IN_FRONT],
                    steps: [{ id: 121211, type: "action", action: OPEN_DOOR }]
                  }
                ]
              },
              { id: 1213, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1220,
            type: "conditional",
            conditions: ["!" + WALL_IN_FRONT],
            steps: [
              {
                id: 1221,
                type: "branch",
                conditions: [
                  {
                    id: 12211,
                    type: "conditional",
                    conditions: [HAS_KEY_SET, DOOR_IN_FRONT],
                    steps: [{ id: 122111, type: "action", action: OPEN_DOOR }]
                  }
                ]
              },
              { id: 1222, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1230,
            type: "conditional",
            conditions: [],
            steps: [{ id: 1231, type: "action", action: TURN_RIGHT }]
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
