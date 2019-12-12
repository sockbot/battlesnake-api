const { findFood, findExit, findEnemy } = require("./pathfinders");
const {
  getDirection,
  largestEnemySnake,
  getEnemySnakes,
  getAdjacentCoords
} = require("./pathfindingHelpers");

const getMove = ({ state, finder, grid }) => {
  const { you } = state;
  const head = state.you.body[0];

  let firstStep = [];

  // default set to unravel self
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
  const enemies = getEnemySnakes({ state });
  if (
    enemies.length === 1 &&
    largestEnemySnake({ state }).body.length < you.body.length &&
    findEnemy({ state, finder, grid }) !== null
  ) {
    console.log("SEEKING ONE ENEMY");
    firstStep = findEnemy({ state, finder, grid })[1];
  } else if (
    enemies.length === 2 &&
    largestEnemySnake({ state }).body.length + 1 < you.body.length &&
    findEnemy({ state, finder, grid }) !== null
  ) {
    console.log("SEEKING TWO ENEMIES");
    firstStep = findEnemy({ state, finder, grid })[1];
  } else if (enemies.length > 2) {
    // find a smaller snake and eat it
    // const smallSnakes = enemies.filter(
    //   enemy => enemy.body.length < you.body.length
    // );
    // smallSnakes.sort(
    //   (a, b) =>
    //     Math.hypot(head.x - a.x, head.y - a.y) -
    //     Math.hypot(head.x - b.x, head.y - b.y)
    // );
  }

  console.log(`${you.name} Final Move:`, firstStep);

  let destination = {};
  if (firstStep === undefined) {
    console.log("Last resort check for safe move");
    for (const cell of getAdjacentCoords(head)) {
      if (grid.isWalkableAt(cell.x, cell.y)) {
        destination = { x: cell.x, y: cell.y };
      }
    }
  } else {
    destination = { x: firstStep[0], y: firstStep[1] };
  }

  // Response data

  const direction = getDirection({ origin: head, destination });
  console.log(`${you.name} move ${direction}`);
  const move = {
    move: direction // one of: ['up','down','left','right']
  };
  return move;
};

module.exports = { getMove };
