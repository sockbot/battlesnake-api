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

module.exports = { getDirection };
