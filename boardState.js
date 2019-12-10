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

module.exports = { setGridSize };
