import Maze, { Direction, move } from "./maze";

describe("Maze", () => {
  it("Should generate maze with the correct size", () => {
    expect(new Maze({ width: 5 }).width).toEqual(5);
    expect(new Maze({ width: 5 }).height).toEqual(5);

    expect(new Maze({ width: 4, height: 8 }).width).toEqual(4);
    expect(new Maze({ width: 4, height: 8 }).height).toEqual(8);
  });

  it("Should be possible to reach every cell", () => {
    const maze = new Maze({ width: 11 });
    const visitedCells = new Set();

    traverse({ x: 0, y: 0 });
    expect(visitedCells.size).toEqual(maze.width * maze.height);

    function traverse(location) {
      if (visitedCells.has(getKey(location))) {
        return;
      } else if (!maze.contains(location)) {
        throw new Error("Moved outside maze");
      }

      visitedCells.add(getKey(location));

      [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT].forEach(
        direction => {
          if (!maze.hasWall(location, direction)) {
            traverse(move(location, direction));
          }
        }
      );
    }

    function getKey(location) {
      return JSON.stringify(location);
    }
  });
});
