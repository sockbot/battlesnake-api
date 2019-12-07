const { setGridSize, setBlocked } = require("./boardState");
const { _ } = require("lodash");
const PF = require("pathfinding");

const getDirection = coordPair => {
  /* coordPair is an object in the form 
    { 
      origin: { x: 0, y: 0 },
      destination: { x: 0, y: 1}
    }
  */

  const { origin, destination } = coordPair;
  const direction = { x: 0, y: 0 };
  if (origin.x === destination.x) {
    direction.y = destination.y - origin.y;
    if (direction.y < 0) {
      return "up";
    }
    return "down";
  } else {
    direction.x = destination.x - origin.x;
    if (direction.x < 0) {
      return "left";
    }
    return "right";
  }
};

const getAdjacentCoords = coord => {
  return [
    {
      x: coord.x + 1,
      y: coord.y
    },
    {
      x: coord.x,
      y: coord.y + 1
    },
    {
      x: coord.x - 1,
      y: coord.y
    },
    {
      x: coord.x,
      y: coord.y - 1
    }
  ];
};

const isATrap = coord => {
  console.log("ISATRAP", coord);
  const trapGrid = grid.clone();
  const move = { x: coord[0], y: coord[1] };
  const surroundings = getAdjacentCoords(move);
  for (const surrounding of surroundings) {
    const isWalkable = trapGrid.isWalkableAt(surrounding.x, surrounding.y);
    if (isWalkable) {
      console.log("IT'S SAFE");
      return false;
    }
  }
  console.log("IT'S A TRAP");
  return true;
};

const setupFinder = ({ state }) => {
  const { board, you } = state;
  let matrix = setGridSize(board.height, board.width);

  for (const snake of board.snakes) {
    matrix = setBlocked({ grid: matrix, coords: snake.body });

    // optional: make the snake tails walkable paths-- risky if a snake eats food on previous turn
    const snakeTail = snake.body[snake.body.length - 1];
    matrix[snakeTail.y][snakeTail.x] = 0;
    if (_.isEqual(snakeTail, snake.body[snake.body.length - 2])) {
      console.log(`${you.name} just ate food`);
      // console.log(matrix);
      matrix[snakeTail.y][snakeTail.x] = 1;
      // console.log(matrix);
    }
  }

  const grid = new PF.Grid(matrix);

  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });
  console.log("Finder setup");
  return { finder, grid };
};

module.exports = { getDirection, getAdjacentCoords, isATrap, setupFinder };
