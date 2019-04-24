import React, { CSSProperties, ReactElement } from "react";
import MazeModel, { Direction, Location } from "../services/maze/maze";

const borderWidth = "1px";

const Maze = ({ maze }: { maze: MazeModel }) => {
  const cellHeight = `${100 / maze.height}%`;
  const cellWidth = `${100 / maze.width}%`;
  const rows: ReactElement[][] = [];

  for (let y = 0; y < maze.height; y++) {
    const cells: ReactElement[] = [];
    rows.push(cells);

    for (let x = 0; x < maze.width; x++) {
      const style: CSSProperties = {
        display: "inline-block",
        width: cellWidth,
        height: "100%",
        boxSizing: "border-box",
        ...getBorderStyle({ x, y }, Direction.UP),
        ...getBorderStyle({ x, y }, Direction.LEFT)
      };

      if (y === maze.height - 1) {
        Object.assign(style, getBorderStyle({ x, y }, Direction.DOWN));
      }
      if (x === maze.width - 1) {
        Object.assign(style, getBorderStyle({ x, y }, Direction.RIGHT));
      }

      cells.push(<div key={x} style={style} />);
    }
  }

  return (
    <>
      {rows.map((cells, y) => (
        <div key={y} style={{ position: "relative", height: cellHeight }}>
          {cells}
        </div>
      ))}
    </>
  );

  function getBorderStyle(location: Location, direction: Direction) {
    const propMap = {
      [Direction.UP]: "Top",
      [Direction.DOWN]: "Bottom",
      [Direction.LEFT]: "Left",
      [Direction.RIGHT]: "Right"
    };

    if (maze.hasWall(location, direction)) {
      return { [`border${propMap[direction]}`]: `${borderWidth} solid black` };
    } else {
      return { [`padding${propMap[direction]}`]: borderWidth };
    }
  }
};

export default Maze;
