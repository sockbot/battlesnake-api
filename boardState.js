const setGridSize = (height, width) => {
  const matrix = [];
  const rows = [];
  for (let i = 0; i < width; i++) {
    rows.push(0);
  }
  for (let i = 0; i < height; i++) {
    matrix.push(rows);
  }
  return matrix;
};

const setBlocked = config => {
  /* config is an object in the form 
    { 
      grid: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      coords: [ 
        { x: 1, y: 1}, 
        ... 
        { x: 2, y: 2} 
      ]
    }
  */
  const grid = config.grid;
  for (const coord of config.coords) {
    grid[coord.x][coord.y] = 1;
  }
  return grid;
};

module.exports = { setGridSize, setBlocked };
