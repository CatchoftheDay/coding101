import { createAction } from "deox";
import { Stage } from "./types";

export const addKeyType = "tutorial/addKey";

export const advanceTo = createAction(
  "tutorial/advanceTo",
  resolve => (stage: Stage) => resolve(stage)
);

export const addKey = createAction(addKeyType, resolve => (key: string) =>
  resolve(key)
);
