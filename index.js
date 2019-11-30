const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const app = express();
const PF = require("pathfinding");
const { setGridSize, setBlocked } = require("./boardState");
const { getDirection } = require("./pathfindingHelpers");

const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require("./handlers.js");

let target = [];

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(poweredByHandler);

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post("/start", (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: "#BBBBBB"
  };

  return response.json(data);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  // NOTE: Do something here to generate your move

  const { board, you, turn } = request.body;
  console.log(`${you.name} turn ${turn}`);

  const head = you.body[0];

  let matrix = setGridSize(board.height, board.width);

  for (const snake of board.snakes) {
    matrix = setBlocked({ grid: matrix, coords: snake.body });

    // optional: make the snake tails walkable paths-- risky if a snake eats food on previous turn
    const snakeTail = snake.body[snake.body.length - 1];
    matrix[snakeTail.y][snakeTail.x] = 0;
  }

  const grid = new PF.Grid(matrix);

  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });

  const findFood = () => {
    if (board.food.length === 0) {
      console.log("NO FOOD IN LIST");
      return undefined;
    }
    const foodGrid = grid.clone();
    // let foodList = [...board.food];

    // foodList.sort(
    //   (a, b) =>
    //     Math.hypot(head.x - a.x, head.y - a.y) -
    //     Math.hypot(head.x - b.x, head.y - b.y)
    // );
    const food = board.food[0]; // set food to first food of stack
    const foodPath = finder.findPath(head.x, head.y, food.x, food.y, foodGrid);
    if (foodPath.length === 0) {
      console.log("NO PATH TO FOOD");
      return undefined;
    }
    console.log("FOUND FOOD", foodPath);
    return foodPath;
  };

  const findExit = () => {
    for (let i = you.body.length - 1; i >= 0; i--) {
      const exitGrid = grid.clone();
      const exit = you.body[i];
      exitGrid.setWalkableAt(head.x, head.y, false);
      exitGrid.setWalkableAt(exit.x, exit.y, true); // origin and dest need to be walkable for finder to work
      if (turn < 3) {
        exitGrid.setWalkableAt(exit.x, exit.y, false); // when snake is newborn and there is no food don't let snake turn back on its tail
      }
      const exitPath = finder.findPath(
        head.x,
        head.y,
        exit.x,
        exit.y,
        exitGrid
      );
      if (exitPath.length !== 0) {
        console.log("FOUND EXIT", exitPath);
        return exitPath;
      }
    }
    return "CAN'T FIND EXIT";
  };

  let firstStep = [];

  if (findFood() === undefined) {
    console.log("NO PATH TO FOOD");
    firstStep = findExit()[1];
  } else {
    firstStep = findFood()[1];
  }
  if (turn <= 1 && head.y === 0) {
    firstStep = [head.x + 1, 0];
  }
  if (turn <= 2 && head.x === board.width - 1) {
    firstStep = [head.x, head.y + 1];
  }

  const destination = { x: firstStep[0], y: firstStep[1] };
  // console.log("Dest:", destination);

  // Response data

  const direction = getDirection({ origin: head, destination });

  const data = {
    move: direction // one of: ['up','down','left','right']
  };

  // console.log("Body:", you.body);
  // console.log("foodPath:", foodPath);
  // console.log("tailPath:", tailPath);
  // console.log("Head:", head);
  // console.log("Tail:", tail);
  // console.log("Food path", foodPath);
  // console.log("Tail path", tailPath);
  // console.log("Board state:", board);

  return response.json(data);
});

app.post("/end", (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({});
});

app.post("/ping", (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use("*", fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});
