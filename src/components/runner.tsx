import React, { CSSProperties } from "react";
import Maze, { Direction, Location } from "../services/maze/maze";
import runnerImg from "./resources/runner.png";

const imageSizeMultiplier = 0.66;

const Runner = ({
  maze,
  location: { x, y },
  facing,
  style
}: {
  maze: Maze;
  crashed: boolean;
  location: Location;
  facing: Direction;
  style?: CSSProperties;
}) => (
  <img
    style={{
      position: "absolute",
      left: `${(100 / maze.width) * (x + (1 - imageSizeMultiplier) / 2)}%`,
      top: `${(100 / maze.height) * (y + (1 - imageSizeMultiplier) / 2)}%`,
      transform: `rotate(${getAngle(facing)}deg)`,
      ...style
    }}
    alt="Runner position"
    src={runnerImg}
    width={`${(100 / maze.width) * imageSizeMultiplier}%`}
    height={`${(100 / maze.height) * imageSizeMultiplier}%`}
  />
);

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
