const { setGridSize } = require("./boardState");
const { _ } = require("lodash");
const PF = require("pathfinding");

const getDirection = coordPair => {
  console.log("calculating direction");
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

const isATrap = (coord, grid) => {
  if (!Array.isArray(coord)) {
    console.log("Coords must be in array format");
    return undefined;
  }
  const move = { x: coord[0], y: coord[1] };
  const surroundings = getAdjacentCoords(move);
  for (const surrounding of surroundings) {
    const isWalkable = grid.isWalkableAt(surrounding.x, surrounding.y);
    if (isWalkable) {
      return false;
    }
  }
  return true;
};

const isInBounds = ({ coord, board }) => {
  return (
    coord.x >= 0 &&
    coord.y >= 0 &&
    coord.x < board.width &&
    coord.y < board.height
  );
};

const setupFinder = ({ state }) => {
  const { board, you } = state;
  const matrix = setGridSize(board.height, board.width);
  const grid = new PF.Grid(matrix);
  for (const snake of board.snakes) {
    // set snake bodies to be unwalkable, except for the tail
    for (let i = 0; i < snake.body.length - 1; i++) {
      grid.setWalkableAt(snake.body[i].x, snake.body[i].y, false);
    }
    const snakeTail = snake.body[snake.body.length - 1];
    if (_.isEqual(snakeTail, snake.body[snake.body.length - 2])) {
      console.log(`${you.name} is growing`);
      grid.setWalkableAt(snakeTail.x, snakeTail.y, false);
    }

    // set spaces next to dangerous snake heads to be unwalkable
    // (bugs may be due to out of bounds pathfinding)
    const dangerousHeads = getDangerousHeads({ state });
    let dangerousSpaces = [];
    for (const head of dangerousHeads) {
      const adjacentHeads = getAdjacentCoords(head);
      for (const coord of adjacentHeads) {
        if (isInBounds({ coord, board })) {
          dangerousSpaces.push(coord);
        }
      }
    }
    console.log(`DANGER TO ${you.name}`, dangerousSpaces);
    for (const space of dangerousSpaces) {
      grid.setWalkableAt(space.x, space.y, false);
    }
  }
  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });
  console.log("Finder setup");
  return { finder, grid };
};

const getDangerousHeads = ({ state }) => {
  const { board, you } = state;
  const dangerousHeads = [];
  for (const snake of board.snakes) {
    if (you.body.length < snake.body.length) dangerousHeads.push(snake.body[0]);
  }
  return dangerousHeads;
};

const isGrowing = snake => {
  const length = snake.body.length;
  if (_.isEqual(snake.body[length - 1], snake.body[length - 2])) {
    return true;
  }
  return false;
};

const largestEnemySnake = ({ state }) => {
  const { board, you } = state;
  const enemies = board.snakes.filter(snake => snake.id !== you.id);
  let largest = {};
  for (const enemy of enemies) {
    if (_.isEmpty(largest) || enemy.body.length > largest.body.length) {
      largest = enemy;
    }
  }
  return largest;
};

module.exports = {
  getDirection,
  getAdjacentCoords,
  isATrap,
  setupFinder,
  getDangerousHeads,
  isGrowing,
  isInBounds,
  largestEnemySnake
};
