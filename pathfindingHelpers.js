const getDirection = coordPair => {
  /* coordPair is an object in the form 
    { 
      origin: { x: 0, y: 0 },
      destination: { x: 0, y: 1}
    }
  */

  const { origin, destination } = coordPair;
  const direction = { x: 0, y: 0 };
  if (origin.x === destination.x) {
    direction.y = destination.y - origin.y;
    if (direction.y < 0) {
      return "up";
    }
    return "down";
  } else {
    direction.x = destination.x - origin.x;
    if (direction.x < 0) {
      return "left";
    }
    return "right";
  }
};

const getAdjacentCoords = coord => {
  return [
    {
      x: coord.x + 1,
      y: coord.y
    },
    {
      x: coord.x,
      y: coord.y + 1
    },
    {
      x: coord.x - 1,
      y: coord.y
    },
    {
      x: coord.x,
      y: coord.y - 1
    }
  ];
};

const isATrap = coord => {
  console.log("ISATRAP", coord);
  const trapGrid = grid.clone();
  const move = { x: coord[0], y: coord[1] };
  const surroundings = getAdjacentCoords(move);
  for (const surrounding of surroundings) {
    const isWalkable = trapGrid.isWalkableAt(surrounding.x, surrounding.y);
    if (isWalkable) {
      console.log("IT'S SAFE");
      return false;
    }
  }
  console.log("IT'S A TRAP");
  return true;
};

module.exports = { getDirection, getAdjacentCoords, isATrap };
