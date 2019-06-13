import { turnLeft } from "../runner/actions";
import reducers from "./reducers";
import { deleteStep, insertStep, setAction, setCondition } from "./actions";
import { mazeRunner } from "./constants";
import { getStep } from "./selectors";

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

  it("Should insert as first condition of branch node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep(
        { id: 1, type: "conditional", condition: "isAtExit", steps: [] },
        1100,
        1110
      )
    );

    expect(newState[0].steps[0].conditions[0].id).toEqual(1);
    expect(newState[0].steps[0].conditions[1].id).toEqual(1110);
  });

  it("Should insert as second condition of a branch node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep(
        { id: 1, type: "conditional", condition: "isAtExit", steps: [] },
        1100,
        null
      )
    );

    expect(newState[0].steps[0].conditions[3].id).toEqual(1);
  });

  it("Should ensure there's always an else branch", () => {
    const newState = reducers(mazeRunner, setCondition(1130, "isAtExit"));

    const branch = getStep(newState, 1100);
    expect(branch.conditions[2].condition).toEqual("isAtExit");
    expect(branch.conditions[3].condition).toEqual(null);
    expect(branch.conditions[3].steps.length).toEqual(0);
  });

  it("Should remove the branch when the last condition is removed", () => {
    const state = [1110, 1120, 1130].reduce((prevState, id) => reducers(prevState, deleteStep(id)), mazeRunner);

    expect(getStep(state, 1100)).toBeUndefined();
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
