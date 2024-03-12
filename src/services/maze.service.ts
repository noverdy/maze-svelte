import D from "../assets/paths/D.png";
import L from "../assets/paths/L.png";
import R from "../assets/paths/R.png";
import U from "../assets/paths/U.png";
import DL from "../assets/paths/DL.png";
import DR from "../assets/paths/DR.png";
import DU from "../assets/paths/DU.png";
import LR from "../assets/paths/LR.png";
import LU from "../assets/paths/LU.png";
import RU from "../assets/paths/RU.png";

interface Point {
  i: number;
  j: number;
}

type Path = "U" | "D" | "L" | "R";

function findPath(maze: number[][], source: Point, destination: Point): string {
  if (source.i === -1 && source.j === -1) {
    throw "Source not set.";
  }
  if (destination.i === -1 && destination.j === -1) {
    throw "Destination not set.";
  }

  const rows = maze.length;
  const cols = maze[0].length;

  const visited: boolean[][] = [...Array(rows)].map(() =>
    Array(cols).fill(false),
  );

  const queue: {
    point: Point;
    path: string;
  }[] = [];
  queue.push({ point: source, path: "" });

  while (queue.length > 0) {
    const currentState = queue.shift()!;
    const { point, path } = currentState;
    const { i, j } = point;

    if (
      i < 0 ||
      i >= rows ||
      j < 0 ||
      j >= cols ||
      maze[i][j] === 1 ||
      visited[i][j]
    ) {
      continue;
    }

    if (i === destination.i && j === destination.j) {
      return path;
    }

    visited[i][j] = true;

    queue.push({ point: { i: i - 1, j }, path: path + "U" });
    queue.push({ point: { i: i + 1, j }, path: path + "D" });
    queue.push({ point: { i, j: j - 1 }, path: path + "L" });
    queue.push({ point: { i, j: j + 1 }, path: path + "R" });
  }

  throw "No path found.";
}

function encodePath(path: string): string[] {
  const pathArray = path.split("") as Path[];
  const mapping = {
    U,
    D,
    L,
    R,
    DL,
    DR,
    DU,
    LR,
    LU,
    RU,
  };

  const inverse = {
    U: "D",
    D: "U",
    L: "R",
    R: "L",
  } as const;

  const encodedPath = [];
  for (let i = 0; i < path.length - 1; i++) {
    const encode = pathArray.slice(i, i + 2);
    encode[0] = inverse[encode[0]];
    encodedPath.push(encode.sort().join(""));
  }
  encodedPath.unshift(pathArray[0]);
  encodedPath.push(inverse[pathArray[pathArray.length - 1]]);

  return encodedPath.map((path) => mapping[path as keyof typeof mapping]);
}

function traverse(
  maze: number[][],
  height: number,
  width: number,
  i: number,
  j: number,
) {
  const up = () => {
    if (i > 1 && maze[i - 2][j] === 1) {
      maze[i - 1][j] = 0;
      traverse(maze, height, width, i - 2, j);
    }
  };
  const left = () => {
    if (j > 1 && maze[i][j - 2] === 1) {
      maze[i][j - 1] = 0;
      traverse(maze, height, width, i, j - 2);
    }
  };
  const down = () => {
    if (i < height - 2 && maze[i + 2][j] === 1) {
      maze[i + 1][j] = 0;
      traverse(maze, height, width, i + 2, j);
    }
  };
  const right = () => {
    if (j < width - 2 && maze[i][j + 2] === 1) {
      maze[i][j + 1] = 0;
      traverse(maze, height, width, i, j + 2);
    }
  };

  maze[i][j] = 0;
  const choices = [up, left, down, right];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  choices.forEach((i) => i());
}

function generate(height: number, width: number) {
  const maze: number[][] = [...Array(height)].map(() => Array(width).fill(1));
  const i = Math.floor((Math.random() * height) / 2 - 1) * 2 + 1;
  const j = Math.floor((Math.random() * width) / 2 - 1) * 2 + 1;
  traverse(maze, height, width, i, j);
  return maze;
}

export { findPath, encodePath, generate };
