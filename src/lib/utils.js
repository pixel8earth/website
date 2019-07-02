function pointToTileFraction(lon, lat, z) {
  var sin = Math.sin(lat * (Math.PI / 180)),
      z2 = Math.pow(2, z),
      x = z2 * (lon / 360 + 0.5),
      y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI)

  // Wrap Tile X
  x = x % z2
  if (x < 0) x = x + z2
  return [x, y, z]
}

function pointToTile (lon, lat, z) {
    var tile = pointToTileFraction(lon, lat, z)
    tile[0] = Math.floor(tile[0])
    tile[1] = Math.floor(tile[1])
    return tile
}

function getBaseLog(base, result) {
  return Math.log(result) / Math.log(base);
}

function llPixel(ll, zoom, _size) {
  var size = _size * Math.pow(2, zoom);
  var d = size / 2;
  var bc = (size / 360);
  var cc = (size / (2 * Math.PI));
  var ac = size;
  var f = Math.min(Math.max(Math.sin((Math.PI / 180) * ll[1]), -0.9999), 0.9999);
  var x = d + ll[0] * bc;
  var y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
  (x > ac) && (x = ac);
  (y > ac) && (y = ac);
  return [x, y];
}

module.exports = {
  llPixel,
  pointToTile,
  getBaseLog
}
