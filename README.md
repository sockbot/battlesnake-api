# Battlesnake AI

A [Battlesnake AI](https://battlesnake.io) written in Javascript for NodeJS.

## Getting started

1. Download binaries for the [Battlesnake server v0.2.23](https://github.com/battlesnakeio/engine/releases/tag/v0.2.23) and install them into their own directory. This release is not tested against any other version and may or may not work. Start the server with the command

```shell
./engine dev
```

You should see a message on the console

```shell
dev form available at http://localhost:3010/
```

2. Clone the Battlesnake AI and install dependencies using

```shell
npm install
```

Run the AI using command

```shell
npm start
```

You should see a message on the console

```shell
Server listening on port 9001
```

3. In your web browser, go to the Battlesnake server url

```shell
http://localhost:3010/
```

4. Add the Battlesnake AI URL

```shell
http://localhost:9001
```

to the game. Click the Start Game button.

To get started you'll need a working NodeJS development environment, and at least read the Heroku docs on [deploying a NodeJS app](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

If you haven't setup a NodeJS development environment before, read [how to get started with NodeJS](http://nodejs.org/documentation/tutorials/). You'll also need [npm](https://www.npmjs.com/) for easy JS dependency management.

This client uses [Express4](http://expressjs.com/en/4x/api.html) for easy route management, read up on the docs to learn more about reading incoming JSON params, writing responses, etc.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Running the AI locally

Fork and clone this repo:

```shell
git clone git@github.com:battlesnakeio/starter-snake-node.git
cd battlesnake-node
```

Install the client dependencies:

```shell
npm install
```

Create an `.env` file in the root of the project and add your environment variables (optional).

Run the server with auto-reloading on file change:

```shell
npm start
```

Test the client in your browser at <http://localhost:5000>

## Deploying to Heroku

Click the Deploy to Heroku button at the top or use the command line commands below.

Create a new NodeJS Heroku app:

```shell
heroku create [APP_NAME]
```

Push code to Heroku servers:

```shell
git push heroku master
```

Open Heroku app in browser:

```shell
heroku open
```

Or go directly via <http://APP_NAME.herokuapp.com>

View/stream server logs:

```shell
heroku logs --tail
```

## Deploying to [Zeit](https://zeit.co/)

Install the now cli and sign up for a [zeit account](https://zeit.co/docs/v1/getting-started/introduction-to-now/).

Deploying is simply:

```shell
now
```
