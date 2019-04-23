import * as seedrandom from "seedrandom";

export interface Location {
  x: number;
  y: number;
}

export enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 4,
  RIGHT = 8
}

/** A marker to say that no path runs through this cell. Cells only ever exist
 * in this state during the building process */
const EMPTY = 16;

const directions: ReadonlyArray<Direction> = [
  Direction.UP,
  Direction.DOWN,
  Direction.LEFT,
  Direction.RIGHT
];

class Maze {
  /** The width of the maze */
  public readonly width: number;

  /** The height of the maze */
  public readonly height: number;

  /** The cells of the maze */
  public readonly cells: ReadonlyArray<ReadonlyArray<number>>;

  // noinspection JSSuspiciousNameCombination
  public constructor({
    randomSeed,
    width,
    height = width,
    pathMaxLength = width * 2
  }: {
    width: number;
    height?: number;
    pathMaxLength?: number;
    randomSeed?: string;
  }) {
    this.width = width;
    this.height = height;
    this.cells = Maze.build(randomSeed, width, height, pathMaxLength);
  }

  /**
   * Returns true if there is a wall at the given location and direction
   */
  public hasWall(location: Location, direction: Direction) {
    const { x, y } = location;

    return (
      this.contains(location) && (this.cells[x][y] & direction) === direction
    );
  }

  /**
   * Returns true if the location exists within the maze
   *
   * @param location The location to check
   */
  public contains(location: Location) {
    return Maze.contains(this.cells, location);
  }

  /**
   * Builds a maze
   *
   * @param randomSeed The seed for the maze
   * @param width The width of the maze
   * @param height The height of the maze
   * @param pathMaxLength The maximum length of any path
   */
  private static build(
    randomSeed: string | undefined,
    width: number,
    height: number,
    pathMaxLength: number
  ): number[][] {
    // Mark the location just outside the top left corner as a possible starting
    // point
    const pathStarts: Location[] = [{ x: -1, y: 0 }];
    const cells = new Array(width);
    const random = seedrandom.alea(randomSeed);

    for (let x = 0; x < cells.length; x++) {
      cells[x] = new Array(height).fill(
        EMPTY | Direction.UP | Direction.DOWN | Direction.LEFT | Direction.RIGHT
      );
    }

    while (pathStarts.length) {
      Maze.addPath(random, cells, pathStarts, pathMaxLength);
    }

    // Rebuild the wall in the top left corner that our first path knocked down
    cells[0][0] |= Direction.LEFT;

    return cells;
  }

  /**
   * Chooses a random starting point and attempts to extend a path.
   */
  private static addPath(
    random: seedrandom.prng,
    cells: number[][],
    pathStarts: Location[],
    pathMaxLength: number
  ) {
    const pathStartIdx = Math.floor(pathStarts.length * random());
    let currentLocation = Maze.addStep(random, cells, pathStarts[pathStartIdx]);

    if (currentLocation) {
      // It was possible to extend a path from this location - keep going until
      // we get blocked or we reach the maximum path length
      for (
        let pathLength = 1;
        currentLocation && pathLength < pathMaxLength;
        pathLength++
      ) {
        pathStarts.push(currentLocation);
        currentLocation = Maze.addStep(random, cells, currentLocation);
      }
    } else {
      // This starting location is boxed in; remove it so we don't try it again
      pathStarts.splice(pathStartIdx, 1);
    }
  }

  /**
   * Adds a step to a path if possible
   *
   * @param random The PRNG to use
   * @param cells The cells to add a step to
   * @param location The location of the new step
   * @return The new location, or null if there aren't any empty cells adjacent
   * to location
   */
  private static addStep(
    random: seedrandom.prng,
    cells: number[][],
    location: Location
  ): Location | null {
    for (let direction of Maze.randomize(random, directions)) {
      const newLocation = move(location, direction);

      if (
        Maze.contains(cells, newLocation) &&
        Maze.isEmpty(cells, newLocation)
      ) {
        const { x, y } = newLocation;

        cells[x][y] &= ~EMPTY;

        Maze.removeWall(cells, location, direction);
        return newLocation;
      }
    }

    return null;
  }

  /**
   * Removes a wall between two cells
   *
   * @param cells The cells to remove the wall from
   * @param location The location to remove the wall from
   * @param direction The direction of the wall
   */
  private static removeWall(
    cells: number[][],
    location: Location,
    direction: Direction
  ) {
    const { x, y } = location;
    const neighbor = move(location, direction);
    const { x: neighborX, y: neighborY } = neighbor;

    if (Maze.contains(cells, location)) {
      cells[x][y] &= ~direction;
    }
    if (Maze.contains(cells, neighbor)) {
      cells[neighborX][neighborY] &= ~opposite(direction);
    }
  }

  /**
   * Returns true if the location exists within the cells
   */
  private static contains(
    cells: ReadonlyArray<ReadonlyArray<number>>,
    { x, y }: Location
  ): boolean {
    return x >= 0 && y >= 0 && x < cells.length && y < cells[0].length;
  }

  /**
   * Returns true if the given cell doesn't have a path going through it
   */
  private static isEmpty(
    cells: ReadonlyArray<ReadonlyArray<number>>,
    { x, y }: Location
  ): boolean {
    return (cells[x][y] & EMPTY) === EMPTY;
  }

  /**
   * Returns a new array with the elements of array in a random order
   */
  private static randomize<T>(
    random: seedrandom.prng,
    array: ReadonlyArray<T>
  ): T[] {
    const result = array.slice();

    for (let i = 0; i < result.length; i++) {
      const swapWith = Math.floor(random() * result.length);
      const tmp = result[i];
      result[i] = result[swapWith];
      result[swapWith] = tmp;
    }

    return result;
  }
}

/**
 * Returns the direction you would face if you turned left from the given direction
 */
export function leftOf(direction: Direction) {
  switch (direction) {
    case Direction.UP:
      return Direction.LEFT;
    case Direction.RIGHT:
      return Direction.UP;
    case Direction.DOWN:
      return Direction.RIGHT;
    case Direction.LEFT:
      return Direction.DOWN;
  }
}

/**
 * Returns the direction you would face if you turned right from the given direction
 */
export function rightOf(direction: Direction) {
  switch (direction) {
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.UP;
  }
}

/**
 * Returns the location delta for moving one step in a given direction
 *
 * @param location
 * @param direction
 */
export function move(location: Location, direction: Direction): Location {
  switch (direction) {
    case Direction.UP:
      return { x: location.x, y: location.y - 1 };
    case Direction.DOWN:
      return { x: location.x, y: location.y + 1 };
    case Direction.LEFT:
      return { x: location.x - 1, y: location.y };
    case Direction.RIGHT:
      return { x: location.x + 1, y: location.y };
  }
}

/**
 * Returns the direction that is the opposite from the given direction
 *
 * @param direction
 */
export function opposite(direction: Direction): Direction {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
  }
}

export default Maze;
