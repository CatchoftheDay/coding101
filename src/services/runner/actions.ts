import { createAction } from "deox";

export const reset = createAction("runner/reset");
export const newMaze = createAction("runner/newMaze");
export const moveForward = createAction("runner/moveForward");
export const turnLeft = createAction("runner/turnLeft");
export const turnRight = createAction("runner/turnRight");
export const step = createAction("runner/step");
