const PF = require("pathfinding");
const _ = require("lodash");
const {
  getDangerousHeads,
  getAdjacentCoords,
  isInBounds
} = require("./pathfindingHelpers");

const setGridSize = (height, width) => {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    const rows = [];
    for (let i = 0; i < width; i++) {
      rows.push(0);
    }
    matrix.push(rows);
  }
  return matrix;
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

module.exports = { setGridSize, setupFinder };
