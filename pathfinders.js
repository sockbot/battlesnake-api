const {
  getAdjacentCoords,
  isGrowing,
  isInBounds,
  getEnemySnakes
} = require("./pathfindingHelpers");

const findFood = ({ state, finder, grid }) => {
  const { board, you } = state;
  const head = you.body[0];
  if (board.food.length === 0) {
    console.log("NO FOOD IN LIST");
    return null;
  }
  const foodGrid = grid.clone();

  let foodList = [...board.food];

  foodList.sort(
    (a, b) =>
      Math.hypot(head.x - a.x, head.y - a.y) -
      Math.hypot(head.x - b.x, head.y - b.y)
  );

  const food = foodList[0]; // set food to first food of stack
  let foodPath = finder.findPath(head.x, head.y, food.x, food.y, foodGrid);

  if (foodPath.length === 0) {
    console.log("NO PATH TO FOOD");
    return null;
  }
  console.log(`${you.name} FOUND FOOD`, foodPath);
  return foodPath;
};

const findExit = ({ state, finder, grid }) => {
  const { board, you } = state;
  const head = you.body[0];
  const tail = you.body[you.body.length - 1];
  // see if there is a direct path to tail
  const exitGrid = grid.clone();
  const exitPath = finder.findPath(head.x, head.y, tail.x, tail.y, exitGrid);
  console.log(`${you.name}'s exitPath`, exitPath);
  if (!isGrowing(you) && exitPath.length !== 0) {
    return exitPath;
  }
  // else search own body from tail to head
  for (let i = you.body.length - 1; i >= 0; i--) {
    // for each body part, check for a path to any of the adjacent cells
    const exits = getAdjacentCoords(you.body[i]);
    for (const exit of exits) {
      // if any of the adjacent cells have a path, return it
      const exitGrid = grid.clone();
      // exit x and y must be within the grid boundaries (>= 0)
      if (isInBounds({ coord: exit, board })) {
        const exitPath = finder.findPath(
          head.x,
          head.y,
          exit.x,
          exit.y,
          exitGrid
        );
        if (exitPath.length !== 0) {
          console.log(`${you.name} FOUND EXIT`, exitPath);
          return exitPath;
        }
      }
    }
  }
  console.log(`${you.name} CAN'T FIND EXIT`);
  return null;
};

const findEnemy = ({ state, finder, grid }) => {
  const { you } = state;
  const head = you.body[0];
  const enemies = getEnemySnakes({ state });
  const enemyGrid = grid.clone();
  const enemyHead = enemies[0].body[0];
  enemyGrid.setWalkableAt(enemyHead.x, enemyHead.y, true);
  const enemyPath = finder.findPath(
    head.x,
    head.y,
    enemyHead.x,
    enemyHead.y,
    enemyGrid
  );
  if (enemyPath.length == 0) {
    console.log(`${you.name} CAN'T FIND ENEMY`);
    return null;
  }
  console.log(`${you.name} FOUND ENEMY`, enemyPath);
  return enemyPath;
};
module.exports = { findFood, findExit, findEnemy };
