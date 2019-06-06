import React, { CSSProperties } from "react";
import Maze, { Direction, Location } from "../services/maze/maze";
import { getDimensions } from "./maze";

const Runner = ({
  maze,
  location,
  facing,
  width = 0,
  height = 0,
  style
}: {
  maze: Maze;
  crashed: boolean;
  location: Location;
  facing: Direction;
  width?: number;
  height?: number;
  style?: CSSProperties;
}) => {
  const { size, left, top } = getDimensions(maze, width, height);
  const { x, y } = location;

  return (
    <div
      style={{
        paddingLeft: left,
        paddingTop: top,
        position: "relative",
        fontSize: "300%",
        fontWeight: "bold",
        ...style
      }}
    >
      <span
        style={{
          position: "absolute",
          top: (y + 0.5) * size,
          left: (x + 0.5) * size,
          transform: `translate(-50%, -50%) rotate(${getAngle(facing)}deg)`
        }}
      >
        ^
      </span>
    </div>
  );
};

const getAngle = (facing: Direction) => {
  switch (facing) {
    case Direction.UP:
      return 0;
    case Direction.RIGHT:
      return 90;
    case Direction.DOWN:
      return 180;
    case Direction.LEFT:
      return 270;
  }
};

export default Runner;
