const assert = require("chai").assert;
const {
  getDirection,
  getAdjacentCoords,
  isATrap
} = require("../pathfindingHelpers");
const PF = require("pathfinding");
const { setGridSize } = require("../boardSetup");

describe("#getDirection", () => {
  it("returns a string", () => {
    const coordPair = {
      origin: { x: 0, y: 0 },
      destination: { x: 0, y: 1 }
    };
    const direction = getDirection(coordPair);
    assert.equal(typeof direction, "string");
  });

  it("returns up for y < 0", () => {
    const coordPair = {
      origin: { x: 0, y: 1 },
      destination: { x: 0, y: 0 }
    };
    const direction = getDirection(coordPair);
    assert.equal(direction, "up");
  });

  it("returns down for y > 0", () => {
    const coordPair = {
      origin: { x: 0, y: 1 },
      destination: { x: 0, y: 2 }
    };
    const direction = getDirection(coordPair);
    assert.equal(direction, "down");
  });

  it("returns left for x < 0", () => {
    const coordPair = {
      origin: { x: 3, y: 0 },
      destination: { x: 2, y: 0 }
    };
    const direction = getDirection(coordPair);
    assert.equal(direction, "left");
  });

  it("returns right for x > 0", () => {
    const coordPair = {
      origin: { x: 4, y: 0 },
      destination: { x: 5, y: 0 }
    };
    const direction = getDirection(coordPair);
    assert.equal(direction, "right");
  });
});

describe("#getAdjacentCoords", () => {
  it("returns the adjacent coords", () => {
    const coordPair = { x: 2, y: 2 };
    const adjacents = getAdjacentCoords(coordPair);
    assert.deepEqual(adjacents, [
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 1 }
    ]);
  });
});

describe("#isATrap", () => {
  const matrix = setGridSize(5, 5);
  const grid = new PF.Grid(matrix);
  grid.setWalkableAt(0, 1, false);
  grid.setWalkableAt(1, 0, false);
  grid.setWalkableAt(2, 1, false);
  grid.setWalkableAt(1, 2, false);

  it("returns true if it's a trap", () => {
    const cell = { x: 1, y: 1 };
    const trap = isATrap({ cell, grid });
    assert.equal(trap, true);
  });

  it("returns false if it's not a trap", () => {
    const cell = { x: 4, y: 4 };
    const trap = isATrap({ cell, grid });
    assert.equal(trap, false);
  });

  it("returns true if the trap includes board edges", () => {
    const cell = { x: 0, y: 0 };
    const trap = isATrap({ cell, grid });
    assert.equal(trap, true);
  });
});
