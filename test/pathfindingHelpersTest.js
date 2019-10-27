const assert = require("chai").assert;
const { getDirection } = require("../pathfindingHelpers");

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
