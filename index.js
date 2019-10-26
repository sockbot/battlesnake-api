const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const app = express();
const PF = require("pathfinding");

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
    // color: '#DFFF00',
  };
  console.log(response.body.board);
  return response.json(data);
});

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  // NOTE: Do something here to generate your move
  const board = request.body.board;
  const matrix = [];
  const grid = new PF.Grid(matrix);
  console.log(board);
  const turn = request.body.turn;
  console.log(turn);
  // Response data
  const moves = ["left", "left", "left", "down"];
  const data = {
    move: moves[turn] // one of: ['up','down','left','right']
  };

  console.log(request.body.turn);
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
