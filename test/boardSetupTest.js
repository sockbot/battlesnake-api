const assert = require("chai").assert;
const { setGridSize } = require("../boardSetup");

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
