import { createAction } from "deox";
import { Step } from "./types";

export const insertStep = createAction(
  "script/insertStep",
  resolve => (
    step: Step,
    parentId: number | undefined,
    beforeId: number | undefined
  ) =>
    resolve({
      step,
      beforeId,
      parentId
    })
);

export const deleteStep = createAction(
  "script/deleteStep",
  resolve => (id: number) => resolve(id)
);

export const setAction = createAction(
  "script/setAction",
  resolve => (id: number, action: string | null) => resolve({ id, action })
);

export const setCondition = createAction(
  "script/setCondition",
  resolve => (id: number, condition: string | null) =>
    resolve({ id, condition })
);
