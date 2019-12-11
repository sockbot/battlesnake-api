const { findFood, findExit, findEnemy } = require("./pathfinders");
const { getDirection, largestSnake } = require("./pathfindingHelpers");

const getMove = ({ state, finder, grid }) => {
  const { board, you } = state;
  const head = state.you.body[0];
  // default set to unravel self

  let firstStep = [];

  // seek exit
  if (findExit({ state, finder, grid }) !== null) {
    console.log("SEEKING EXIT");
    firstStep = findExit({ state, finder, grid })[1];
  }

  // seek food if available
  if (findFood({ state, finder, grid }) !== null) {
    console.log("SEEKING FOOD");
    firstStep = findFood({ state, finder, grid })[1];
  }

  // seek enemy if bigger and head to head
  const enemies = board.snakes.filter(snake => snake.id !== you.id);
  if (
    enemies.length <= 2 &&
    largestSnake({ board }).length + 1 < you.body.length &&
    findEnemy({ state, finder, grid }) !== null
  ) {
    console.log("SEEKING ENEMY");
    firstStep = findEnemy({ state, finder, grid })[1];
  }

  console.log(`${you.name} Final Move:`, firstStep);
  const destination = { x: firstStep[0], y: firstStep[1] };

  // Response data

  const direction = getDirection({ origin: head, destination });
  console.log(`${you.name} move ${direction}`);
  const move = {
    move: direction // one of: ['up','down','left','right']
  };
  return move;
};

module.exports = { getMove };
