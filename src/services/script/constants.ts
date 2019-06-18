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
  SET_HAS_KEY,
  DOOR_ON_LEFT
} from "../../constants";

export const mazeRunner: Script = [
  {
    id: 1000,
    type: "while",
    conditions: [{ id: 9001, condition: AT_FINISH, negated: true }],
    steps: [
      {
        id: 1100,
        type: "branch",
        conditions: [
          {
            id: 1110,
            type: "conditional",
            conditions: [{ id: 9002, condition: ON_KEY }],
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
            conditions: [
              { id: 9003, condition: DOOR_ON_LEFT },
              { id: 9004, condition: HAS_KEY_SET }
            ],
            steps: [
              { id: 1211, type: "action", action: TURN_LEFT },
              { id: 1212, type: "action", action: OPEN_DOOR },
              { id: 1213, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1220,
            type: "conditional",
            conditions: [
              { id: 9005, condition: WALL_ON_LEFT, negated: true },
              { id: 9006, condition: DOOR_ON_LEFT, negated: true }
            ],
            steps: [
              { id: 1221, type: "action", action: TURN_LEFT },
              { id: 1222, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1230,
            type: "conditional",
            conditions: [
              { id: 9007, condition: DOOR_IN_FRONT },
              { id: 9008, condition: HAS_KEY_SET }
            ],
            steps: [
              { id: 1231, type: "action", action: OPEN_DOOR },
              { id: 1232, type: "action", action: MOVE_FORWARD }
            ]
          },
          {
            id: 1240,
            type: "conditional",
            conditions: [
              { id: 9009, condition: WALL_IN_FRONT, negated: true },
              { id: 9010, condition: DOOR_IN_FRONT, negated: true }
            ],
            steps: [{ id: 1241, type: "action", action: MOVE_FORWARD }]
          },
          {
            id: 1250,
            type: "conditional",
            conditions: [],
            steps: [{ id: 1251, type: "action", action: TURN_RIGHT }]
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
