import { createAction } from "deox";
import { Stage } from "./types";

export const advanceTo = createAction(
  "tutorial/advanceTo",
  resolve => (stage: Stage) => resolve(stage)
);
