import { Script } from "./types";

export const mazeRunner: Script = [
  {
    id: 1000,
    type: "while",
    condition: "notAtExit",
    steps: [
      {
        id: 1100,
        type: "branch",
        conditions: [
          {
            id: 1110,
            type: "condition",
            condition: "canMoveLeft",
            steps: [
              { id: 1111, type: "action", action: "turnLeft" },
              { id: 1112, type: "action", action: "moveForward" }
            ]
          },
          {
            id: 1120,
            type: "condition",
            condition: "canMoveForward",
            steps: [{ id: 1121, type: "action", action: "moveForward" }]
          },
          {
            id: 1130,
            type: "condition",
            condition: null,
            steps: [{ id: 1131, type: "action", action: "turnRight" }]
          }
        ]
      }
    ]
  }
];

export const ItemTypes = {
  STEP: "step"
};
