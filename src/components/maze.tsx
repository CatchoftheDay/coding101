import React, { CSSProperties, ReactElement } from "react";
import MazeModel, { Direction, Location } from "../services/maze/maze";

const borderWidth = "1px";
const finishGridSize = 6;

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
  const { size, left, top } = getDimensions(maze, width, height);
  const rows: ReactElement[][] = [];

  for (let y = 0; y < maze.height; y++) {
    const cells: ReactElement[] = [];
    rows.push(cells);

    for (let x = 0; x < maze.width; x++) {
      const cellStyle: CSSProperties = {
        display: "inline-block",
        width: `${size}px`,
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

      let inner = null;
      if (x === maze.width - 1 && y === maze.height - 1) {
        cellStyle.position = "relative";
        inner = buildFinishMarker();
      }

      cells.push(
        <div key={x} style={cellStyle}>
          {inner}
        </div>
      );
    }
  }

  return (
    <div
      style={{
        paddingLeft: `${left}px`,
        paddingTop: `${top}px`,
        ...style
      }}
    >
      {rows.map((cells, y) => (
        <div key={y} style={{ position: "relative", height: `${size}px` }}>
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

const buildFinishMarker = () => {
  const elements: ReactElement[] = [];
  const sizePc = 100 / finishGridSize;
  const size = `${sizePc}%`;

  for (let y = 0; y < finishGridSize; y++) {
    for (let x = y % 2; x < finishGridSize; x += 2) {
      elements.push(
        <div
          key={`${x}.${y}`}
          style={{
            position: "absolute",
            top: `${y * sizePc}%`,
            left: `${x * sizePc}%`,
            width: size,
            height: size,
            background: "#ddd"
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: borderWidth,
        left: borderWidth,
        right: borderWidth,
        bottom: borderWidth
      }}
    >
      {elements}
    </div>
  );
};

export default Maze;
