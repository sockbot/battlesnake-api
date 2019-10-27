const setGridSize = (height, width) => {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    const rows = [];
    for (let i = 0; i < width; i++) {
      rows.push(0);
    }
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
  const { grid, coords } = config;

  for (const coord of coords) {
    grid[coord.x][coord.y] = 1;
  }
  return grid;
};

module.exports = { setGridSize, setBlocked };
