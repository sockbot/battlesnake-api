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

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  // NOTE: Do something here to generate your move

  const { board, you, turn } = request.body;
  const origin = you.body[0];
  const firstFood = board.food[0];

  let matrix = setGridSize(board.height, board.width);
  matrix = setBlocked({ grid: matrix, coords: you.body });

  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder();
  const path = finder.findPath(
    origin.x,
    origin.y,
    firstFood.x,
    firstFood.y,
    grid
  );
  console.log(path);
  const firstStep = path[1];
  const destination = { x: firstStep[0], y: firstStep[1] };

  // Response data

  const direction = getDirection({ origin, destination });

  const data = {
    move: direction // one of: ['up','down','left','right']
  };

  console.log("Turn:", turn);
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
