import { createAction } from "deox";

export const reset = createAction("runner/reset");
export const moveForward = createAction("runner/moveForward");
export const turnLeft = createAction("runner/turnLeft");
export const turnRight = createAction("runner/turnRight");
export const startNextAnimation = createAction("runner/startNextAnimation");
