const { _ } = require("lodash");

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

const isATrap = ({ cell, grid }) => {
  const surroundings = getAdjacentCoords(cell);
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

const getDangerousHeads = ({ state }) => {
  const { you } = state;
  const dangerousHeads = [];
  const enemies = getEnemySnakes({ state });
  for (const enemy of enemies) {
    if (you.body.length < enemy.body.length) dangerousHeads.push(enemy.body[0]);
  }
  return dangerousHeads;
};

const getEnemySnakes = ({ state }) => {
  const { board, you } = state;
  return board.snakes.filter(snake => snake.id !== you.id);
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
  const enemies = getEnemySnakes({ state });
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
  getDangerousHeads,
  isGrowing,
  isInBounds,
  largestEnemySnake,
  getEnemySnakes
};
