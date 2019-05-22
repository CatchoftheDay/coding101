import { turnLeft } from "../runner/actions";
import reducers from "./reducers";
import { deleteStep, insertStep, setAction, setCondition } from "./actions";
import { mazeRunner } from "./constants";

describe("Script reducers", () => {
  it("Should insert before root node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, null, 1000)
    );

    expect(newState[0].id).toEqual(1);
  });

  it("Should insert after root node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, null, null)
    );

    expect(newState[0].id).toEqual(1000);
    expect(newState[1].id).toEqual(1);
  });

  it("Should insert before branch node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, 1100, 1110)
    );

    expect(newState[0].steps[0].conditions[0].id).toEqual(1);
    expect(newState[0].steps[0].conditions[1].id).toEqual(1110);
  });

  it("Should insert after branch node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: "turnLeft" }, 1100, null)
    );

    expect(newState[0].steps[0].conditions[3].id).toEqual(1);
  });

  it("Should delete root node correctly", () => {
    const newState = reducers(mazeRunner, deleteStep(1000));

    expect(newState.length).toEqual(0);
  });

  it("Should delete branch node correctly", () => {
    const newState = reducers(mazeRunner, deleteStep(1110));

    expect(newState[0].steps[0].conditions[0].id).toEqual(1120);
  });

  it("Should set the action", () => {
    const newState = reducers(mazeRunner, setAction(1111, "turnRight"));

    expect(newState[0].steps[0].conditions[0].steps[0].action).toEqual(
      "turnRight"
    );
  });

  it("Should set the condition", () => {
    const newState = reducers(mazeRunner, setCondition(1110, "isAtExit"));

    expect(newState[0].steps[0].conditions[0].condition).toEqual("isAtExit");
  });
});
