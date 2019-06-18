import Maze, { Direction, Location } from "../maze/maze";
import { Script } from "../script/types";

export interface RunnerState {
  location: Location;
  facing: Direction;
  error?: string;
  maze: Maze;
  script: Script;
  currStepId: number | undefined;
  hasKey: boolean;
  doorOpen: boolean;
  variables: {
    hasKey: boolean;
  };
  running: boolean;
  runHandle?: number;
  movements: number;
}
