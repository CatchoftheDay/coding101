import reducers from "./reducers";
import { deleteStep, insertStep, setAction, insertCondition } from "./actions";
import { mazeRunner } from "./constants";
import { getStep } from "./selectors";
import {
  AT_FINISH,
  DOOR_ON_LEFT,
  TURN_LEFT,
  TURN_RIGHT
} from "../../constants";

describe("Script reducers", () => {
  it("Should insert before root node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: TURN_LEFT }, null, 1000)
    );

    expect(newState[0].id).toEqual(1);
  });

  it("Should insert after root node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep({ id: 1, type: "action", action: TURN_LEFT }, null, null)
    );

    expect(newState[0].id).toEqual(1000);
    expect(newState[1].id).toEqual(1);
  });

  it("Should insert as first condition of branch node correctly", () => {
    const newState = reducers(
      mazeRunner,
      insertStep(
        { id: 1, type: "conditional", condition: "isAtFinish", steps: [] },
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
        {
          id: 1,
          type: "conditional",
          conditions: [{ id: 888, condition: "isAtFinish" }],
          steps: []
        },
        1100,
        null
      )
    );

    expect(getStep(newState, 1100).conditions[1].id).toEqual(1);
  });

  it("Should ensure there's always an else branch when setting a condition", () => {
    const newState = reducers(
      mazeRunner,
      insertCondition(1250, { id: 998, condition: "isAtFinish" })
    );

    const branch = getStep(newState, 1200);
    expect(branch.conditions[4].conditions[0].condition).toEqual("isAtFinish");
    expect(branch.conditions[5].conditions.length).toEqual(0);
    expect(branch.conditions[5].steps.length).toEqual(0);
  });

  it("Should ensure there's always an else branch when inserting a new branch step", () => {
    const newState = reducers(
      [],
      insertStep(
        { id: 1, type: "branch", conditions: [] },
        undefined,
        undefined
      )
    );

    expect(newState[0].id).toEqual(1);
    expect(newState[0].conditions.length).toEqual(1);
  });

  it("Should remove the branch when the last condition is removed", () => {
    const state = [1210, 1220, 1230, 1240, 1250].reduce(
      (prevState, id) => reducers(prevState, deleteStep(id)),
      mazeRunner
    );

    expect(getStep(state, 1200)).toBeUndefined();
  });

  it("Should delete root node correctly", () => {
    const newState = reducers(mazeRunner, deleteStep(1000));

    expect(newState.length).toEqual(0);
  });

  it("Should delete branch node correctly", () => {
    const newState = reducers(mazeRunner, deleteStep(1210));

    expect(getStep(newState, 1200).conditions[0].id).toEqual(1220);
  });

  it("Should set the action", () => {
    const newState = reducers(mazeRunner, setAction(1111, TURN_RIGHT));

    expect(newState[0].steps[0].conditions[0].steps[0].action).toEqual(
      TURN_RIGHT
    );
  });

  it("Should insert conditions", () => {
    let state = reducers(
      mazeRunner,
      insertCondition(1110, { id: 999, condition: AT_FINISH })
    );
    state = reducers(
      state,
      insertCondition(1110, { id: 998, condition: DOOR_ON_LEFT }, 999)
    );

    expect(getStep(state, 1110).conditions[1].condition).toEqual(DOOR_ON_LEFT);
    expect(getStep(state, 1110).conditions[2].condition).toEqual(AT_FINISH);
  });
});
