import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import React, { CSSProperties, ReactElement } from "react";
import MazeModel, { Direction, Location } from "../services/maze/maze";

const borderWidth = 1;
const borderWidthPx = `${borderWidth}px`;
const finishGridSize = 6;
const keySizePc = 40;
const keyColor = "#cc0000";

const Maze = ({ maze, style }: { maze: MazeModel; style?: CSSProperties }) => {
  const cells: ReactElement[] = [];

  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      const cellStyle: CSSProperties = {
        position: "absolute",
        left: `${(100 * x) / maze.width}%`,
        top: `${(100 * y) / maze.height}%`,
        width: `${100 / maze.width}%`,
        height: `${100 / maze.height}%`,
        boxSizing: "border-box"
      };

      if (y < maze.height - 1) {
        Object.assign(cellStyle, getBorderStyle({ x, y }, Direction.DOWN));
      }
      if (x < maze.width - 1) {
        Object.assign(cellStyle, getBorderStyle({ x, y }, Direction.RIGHT));
      }

      let inner: ReactElement[] = [];
      if (x === maze.width - 1 && y === maze.height - 1) {
        cellStyle.position = "relative";
        inner.push(...buildFinishMarker());
      }
      if (maze.keyLocation.x === x && maze.keyLocation.y === y) {
        inner.push(
          <FontAwesomeIcon
            key="key"
            icon={faKey}
            color={keyColor}
            style={{
              position: "absolute",
              top: `${(100 - keySizePc) / 2}%`,
              left: `${(100 - keySizePc) / 2}%`,
              width: `${keySizePc}%`,
              height: `${keySizePc}%`
            }}
          />
        );
      }
      cells.push(
        <div key={`${x}.${y}`} style={cellStyle}>
          {inner}
        </div>
      );
    }
  }

  return <div style={style}>{cells}</div>;

  function getBorderStyle(location: Location, direction: Direction) {
    const propMap = {
      [Direction.UP]: "Top",
      [Direction.DOWN]: "Bottom",
      [Direction.LEFT]: "Left",
      [Direction.RIGHT]: "Right"
    };

    if (maze.hasWall(location, direction)) {
      return {
        [`border${propMap[direction]}`]: `${borderWidthPx} solid black`
      };
    } else if (maze.hasDoor(location, direction)) {
      return {
        [`border${propMap[direction]}`]: `${borderWidth *
          2}px dashed ${keyColor}`
      };
    } else {
      return { [`padding${propMap[direction]}`]: borderWidthPx };
    }
  }
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

  return elements;
};

export default Maze;
