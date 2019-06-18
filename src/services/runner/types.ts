import Maze, { Direction, Location } from "../maze/maze";
import { Script } from "../script/types";

export interface RunnerState {
  // Maze state
  script: Script;
  movements: number;
  addDoor: boolean;
  mazeSize: number;
  smallMazeSize: number;
  smallMaze: boolean;
  randomSeed: string;

  // Resettable
  currStepId: number | undefined;
  location: Location;
  facing: Direction;
  hasKey: boolean;
  doorOpen: boolean;
  variables: {
    hasKey: boolean;
  };
  running: boolean;
  error?: string;

  // Auto-generated
  maze: Maze;
  runHandle?: number;
}
