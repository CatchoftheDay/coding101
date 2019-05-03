import { turnLeft } from "../runner/actions";
import reducers from "./reducers";
import { deleteStep, insertStep, setAction, setCondition } from "./actions";

const initialState = [
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

describe("Script reducers", () => {
  it("Should insert before root node correctly", () => {
    const newState = reducers(
      initialState,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, null, 1000)
    );

    expect(newState[0].id).toEqual(1);
  });

  it("Should insert after root node correctly", () => {
    const newState = reducers(
      initialState,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, null, null)
    );

    expect(newState[0].id).toEqual(1000);
    expect(newState[1].id).toEqual(1);
  });

  it("Should insert before branch node correctly", () => {
    const newState = reducers(
      initialState,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, 1100, 1110)
    );

    expect(newState[0].steps[0].conditions[0].id).toEqual(1);
    expect(newState[0].steps[0].conditions[1].id).toEqual(1110);
  });

  it("Should insert after branch node correctly", () => {
    const newState = reducers(
      initialState,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, 1100, null)
    );

    expect(newState[0].steps[0].conditions[3].id).toEqual(1);
  });

  it("Should delete root node correctly", () => {
    const newState = reducers(initialState, deleteStep(1000));

    expect(newState.length).toEqual(0);
  });

  it("Should delete branch node correctly", () => {
    const newState = reducers(initialState, deleteStep(1110));

    expect(newState[0].steps[0].conditions[0].id).toEqual(1120);
  });

  it("Should set the action", () => {
    const newState = reducers(initialState, setAction(1111, "turnRight"));

    expect(newState[0].steps[0].conditions[0].steps[0].action).toEqual(
      "turnRight"
    );
  });

  it("Should set the condition", () => {
    const newState = reducers(initialState, setCondition(1110, "isAtExit"));

    expect(newState[0].steps[0].conditions[0].condition).toEqual("isAtExit");
  });
});
