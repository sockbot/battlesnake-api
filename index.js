const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const app = express();
const { setupFinder } = require("./pathfindingHelpers");

const { move } = require("./move");
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
  if (request.body.you.name === "andy") {
    const color = {
      color: "#EC86AC"
    };
    return response.json(color);
  }

  return response.json();
});

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  // NOTE: Do something here to generate your move

  const state = request.body;
  console.log(`${state.you.name} turn ${state.turn}`);

  const { finder, grid } = setupFinder({ state });

  return response.json(move({ state, finder, grid }));
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
