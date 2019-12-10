const { findFood, findExit, findEnemy } = require("./pathfinders");
const { getDirection } = require("./pathfindingHelpers");

const move = ({ state, finder, grid }) => {
  const { board, you, turn } = state;
  const head = state.you.body[0];
  // default set to unravel self
  let firstStep = findExit({ state, finder, grid })[1];

  // seek food if available
  if (findFood({ state, finder, grid }) !== undefined) {
    console.log("SEEKING FOOD");
    firstStep = findFood({ state, finder, grid })[1];
  }

  // seek enemy if bigger and head to head
  const enemies = board.snakes.filter(snake => snake.id !== you.id);
  if (
    enemies.length === 1 &&
    enemies[0].body.length + 1 < you.body.length &&
    findEnemy({ state, finder, grid }) !== undefined
  ) {
    console.log("SEEKING ENEMY");
    firstStep = findEnemy({ state, finder, grid })[1];
  }

  // hardcoded moves to deal with edge case with spawning close to top of board
  if (turn <= 1 && head.y === 0) {
    firstStep = [head.x + 1, 0];
  }
  if (turn <= 2 && head.x === board.width - 1) {
    firstStep = [head.x, head.y + 1];
  }

  console.log("Final step:", firstStep);
  const destination = { x: firstStep[0], y: firstStep[1] };

  // Response data

  const direction = getDirection({ origin: head, destination });
  console.log(`${you.name} move ${direction}`);
  const move = {
    move: direction // one of: ['up','down','left','right']
  };
  return move;
};

module.exports = { move };
