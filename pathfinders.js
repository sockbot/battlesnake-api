const { getAdjacentCoords } = require("./pathfindingHelpers");

const findFood = ({ state, finder, grid }) => {
  const { board, you } = state;
  const head = you.body[0];
  if (board.food.length === 0) {
    console.log("NO FOOD IN LIST");
    return undefined;
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
    return undefined;
  }
  console.log("FOUND FOOD", foodPath);
  return foodPath;
};

const findExit = ({ state, finder, grid }) => {
  const { you, turn } = state;
  const head = you.body[0];
  console.log("SEARCHING FOR EXIT");
  // search own body from tail to head
  for (let i = you.body.length - 1; i >= 0; i--) {
    const exitGrid = grid.clone();
    const exit = you.body[i];
    const exits = getAdjacentCoords(exit);
    exitGrid.setWalkableAt(head.x, head.y, false);
    // origin and dest need to be walkable for finder to work;
    // risky if no food on board and head is next to own tail
    exitGrid.setWalkableAt(exit.x, exit.y, true);
    if (turn < 3) {
      // when snake is newborn and there is no food don't let snake turn back on its tail
      exitGrid.setWalkableAt(exit.x, exit.y, false);
    }
    const exitPath = finder.findPath(head.x, head.y, exit.x, exit.y, exitGrid);
    if (exitPath.length !== 0) {
      for (const exit of exits) {
        console.log("HEAD", head);
        console.log("EXIT", exit);
        const escapeGrid = grid.clone();
        const escapePath = finder.findPath(
          head.x,
          head.y,
          exit.x,
          exit.y,
          escapeGrid
        );
        if (escapePath.length !== 0) {
          console.log("FOUND EXIT", escapePath);
          return escapePath;
        } else {
          console.log("CANT FIND ESCAPE");
        }
      }
    }
  }
  console.log("CAN'T FIND EXIT");
  return undefined;
};

const findEnemy = ({ state, finder, grid }) => {
  const { board, you } = state;
  const head = you.body[0];
  const enemies = board.snakes.filter(snake => snake.id !== you.id);
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
    console.log("CAN'T FIND ENEMY");
    return undefined;
  }
  console.log("SEEKING ENEMY", enemyPath);
  return enemyPath;
};
module.exports = { findFood, findExit, findEnemy };
