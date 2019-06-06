import React, { CSSProperties, ReactElement } from "react";
import MazeModel, { Direction, Location } from "../services/maze/maze";

const borderWidth = "1px";

const Maze = ({
  maze,
  style,
  width = 0,
  height = 0
}: {
  maze: MazeModel;
  style?: CSSProperties;
  width?: number;
  height?: number;
}) => {
  const desiredCellHeight = height / maze.height;
  const desiredCellWidth = width / maze.width;
  const cellSize = Math.floor(Math.min(desiredCellHeight, desiredCellWidth));
  const leftPadding = (width - cellSize * maze.width) / 2;
  const topPadding = (height - cellSize * maze.height) / 2;
  const rows: ReactElement[][] = [];

  for (let y = 0; y < maze.height; y++) {
    const cells: ReactElement[] = [];
    rows.push(cells);

    for (let x = 0; x < maze.width; x++) {
      const cellStyle: CSSProperties = {
        display: "inline-block",
        width: `${cellSize}px`,
        height: "100%",
        boxSizing: "border-box",
        ...getBorderStyle({ x, y }, Direction.UP),
        ...getBorderStyle({ x, y }, Direction.LEFT)
      };

      if (y === maze.height - 1) {
        Object.assign(cellStyle, getBorderStyle({ x, y }, Direction.DOWN));
      }
      if (x === maze.width - 1) {
        Object.assign(cellStyle, getBorderStyle({ x, y }, Direction.RIGHT));
      }

      cells.push(<div key={x} style={cellStyle} />);
    }
  }

  return (
    <div
      style={{
        paddingLeft: `${leftPadding}px`,
        paddingTop: `${topPadding}px`,
        ...style
      }}
    >
      {rows.map((cells, y) => (
        <div key={y} style={{ position: "relative", height: `${cellSize}px` }}>
          {cells}
        </div>
      ))}
    </div>
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
