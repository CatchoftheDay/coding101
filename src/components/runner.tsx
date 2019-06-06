import React, { CSSProperties } from "react";
import Maze, { Direction, Location } from "../services/maze/maze";
import { getDimensions } from "./maze";
import runnerImg from "./resources/runner.png";

const maxSize = 64;
const imageSizeMultiplier = 0.66;

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
        marginLeft: left,
        marginTop: top,
        position: "relative",
        fontSize: "300%",
        fontWeight: "bold",
        ...style
      }}
    >
      <img
        style={{
          position: "absolute",
          top: (y + 0.5) * size,
          left: (x + 0.5) * size,
          transform: `translate(-50%, -50%) rotate(${getAngle(facing)}deg)`
        }}
        alt="Runner position"
        src={runnerImg}
        width={`${Math.min(size * imageSizeMultiplier, maxSize)}px`}
        height={`${Math.min(size * imageSizeMultiplier, maxSize)}px`}
      />
    </div>
  );
};

const getAngle = (facing: Direction) => {
  switch (facing) {
    case Direction.UP:
      return -90;
    case Direction.RIGHT:
      return 0;
    case Direction.DOWN:
      return 90;
    case Direction.LEFT:
      return 180;
  }
};

export default Runner;
