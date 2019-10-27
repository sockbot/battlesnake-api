const assert = require("chai").assert;
const { setGridSize, setBlocked } = require("../boardState");

const threeByThreeGrid = setGridSize(3, 3);

describe("#setGridSize", () => {
  it("returns a 3x3 grid", () => {
    // console.log(threeByThreeGrid);
    assert.equal(threeByThreeGrid.length, 3);
    assert.notEqual(threeByThreeGrid.length, 4);
    assert.equal(threeByThreeGrid[0].length, 3);
    assert.notEqual(threeByThreeGrid[0].length, 6);
  });
});

describe("#setBlocked", () => {
  it("sets blocked coordinates", () => {
    const config = {
      grid: threeByThreeGrid,
      coords: [{ x: 0, y: 1 }, { x: 1, y: 2 }]
    };
    const grid = setBlocked(config);
    assert.deepEqual(grid, [[0, 1, 0], [0, 0, 1], [0, 0, 0]]);
    assert.notDeepEqual(grid, [[0, 1, 0], [0, 0, 1], [0, 0, 1]]);
  });
});
