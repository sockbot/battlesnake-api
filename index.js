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
  const head = you.body[0];
  const tail = you.body[you.body.length - 1];
  // const food = board.food[0];

  let foodList = [...board.food];

  foodList.sort(
    (a, b) =>
      Math.hypot(head.x - a.x, head.y - a.y) -
      Math.hypot(head.x - b.x, head.y - b.y)
  );

  let matrix = setGridSize(board.height, board.width);

  for (const snake of board.snakes) {
    matrix = setBlocked({ grid: matrix, coords: snake.body });

    // optional: make the snake tails walkable paths-- risky if snake eats food on previous turn
    // const snakeTail = snake.body[snake.body.length - 1];
    // matrix[snakeTail.y][snakeTail.x] = 0;
  }

  const grid = new PF.Grid(matrix);
  // const tailGrid = new PF.Grid(matrix);

  const foodGrid = grid.clone();
  // const tailGrid = grid.clone();

  const finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
  });

  const food = foodList[0];
  const foodPath = finder.findPath(head.x, head.y, food.x, food.y, foodGrid);
  // const tailPath = finder.findPath(head.x, head.y, tail.x, tail.y, tailGrid);

  let firstStep = foodPath[1];
  if (!Array.isArray(firstStep)) {
    console.log("NO PATH TO FOOD");
    console.log("Tailpath:", tailPath);
    firstStep = tailPath[1];
    if (!Array.isArray(firstStep)) {
      console.log("NO PATH TO TAIL");
    }
  }

  const destination = { x: firstStep[0], y: firstStep[1] };
  // console.log("Dest:", destination);

  // Response data

  const direction = getDirection({ origin: head, destination });

  const data = {
    move: direction // one of: ['up','down','left','right']
  };

  console.log("Turn:", turn);
  // console.log("Body:", you.body);
  // console.log("foodPath:", foodPath);
  // console.log("tailPath:", tailPath);
  console.log("Head:", head);
  console.log("Tail:", tail);
  // console.log("Food path", foodPath);
  // console.log("Tail path", tailPath);
  console.log("Board state:", board);

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
