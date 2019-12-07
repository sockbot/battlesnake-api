const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const app = express();
const { getDirection, setupFinder } = require("./pathfindingHelpers");
const { findFood, findExit, findEnemy } = require("./pathfinders");

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
  const color = {
    color: "#EC86AC"
  };

  return response.json(color);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  // NOTE: Do something here to generate your move

  const { board, you, turn } = request.body;
  const state = request.body;
  console.log(`${you.name} turn ${turn}`);

  const head = you.body[0];

  const { finder, grid } = setupFinder({ state });

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

  return response.json(move);
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
// disable handler to show error messages
// app.use(genericErrorHandler);

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});
