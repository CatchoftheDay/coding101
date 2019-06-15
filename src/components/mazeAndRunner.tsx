import React from "react";
import MazeModel, { Direction, Location } from "../services/maze/maze";
import Maze from "./maze";
import Runner from "./runner";

const MazeAndRunner = ({
  maze,
  crashed,
  location,
  facing,
  width = 0,
  height = 0
}: {
  maze: MazeModel;
  crashed: boolean;
  location: Location;
  facing: Direction;
  width?: number;
  height?: number;
}) => {
  const { size } = getDimensions(maze, width, height);

  return (
    <div
      style={{
        position: "relative",
        width: `${size * maze.width}px`,
        height: `${size * maze.width}px`,
        border: "2px solid black"
      }}
    >
      <Maze maze={maze} style={{ position: "relative", height: "100%" }} />
      <Runner
        maze={maze}
        crashed={crashed}
        location={location}
        facing={facing}
        style={{ position: "absolute" }}
      />
    </div>
  );
};

/** Gets the cell size and left and top margins */
export const getDimensions = (
  maze: MazeModel,
  width: number,
  height: number
) => {
  const desiredCellHeight = height / maze.height;
  const desiredCellWidth = width / maze.width;
  const size = Math.floor(Math.min(desiredCellHeight, desiredCellWidth));
  const left = (width - size * maze.width) / 2;
  const top = (height - size * maze.height) / 2;

  return { size, left, top };
};

export default MazeAndRunner;
