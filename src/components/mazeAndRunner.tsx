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
}) => (
  <div style={{ position: "relative" }}>
    <Maze
      maze={maze}
      width={width}
      height={height}
      style={{ position: "relative" }}
    />
    <Runner
      maze={maze}
      crashed={crashed}
      location={location}
      facing={facing}
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  </div>
);

export default MazeAndRunner;
