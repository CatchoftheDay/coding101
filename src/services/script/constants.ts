import { Script } from "./types";

export const mazeRunner: Script = [
  {
    id: 1000,
    type: "while",
    condition: "!atFinish",
    steps: [
      {
        id: 1100,
        type: "branch",
        conditions: [
          {
            id: 1110,
            type: "conditional",
            condition: "canMoveLeft",
            steps: [
              { id: 1111, type: "action", action: "turnLeft" },
              { id: 1112, type: "action", action: "moveForward" }
            ]
          },
          {
            id: 1120,
            type: "conditional",
            condition: "canMoveForward",
            steps: [{ id: 1121, type: "action", action: "moveForward" }]
          },
          {
            id: 1130,
            type: "conditional",
            condition: null,
            steps: [{ id: 1131, type: "action", action: "turnRight" }]
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
