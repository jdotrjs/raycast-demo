export const printErrors = false

/**
 * Checks intersection between a line and a rectangle; if they intersect
 * returns the point representing where it happens nearest line origin.
 *
 * @param {Phaser.Geom.Line} line A line we want to find an intersection
 *    point on; (x1, y1) is treated as the origin when determining "nearest"
 * @param {Phaser.Geom.Rectangle} rect The rectangle we're checking for
 *    intersection
 *
 * @returns {null | Phaser.Geom.Point} null or the point closest to the origin
 *    where the line and rectangle intersect
 */
const intersectRect = (line, rect) => {
  if (!Phaser.Geom.Intersects.LineToRectangle(line, rect)) {
    return null
  }

  const lx = line.x1
  const ly = line.y1

  if (Phaser.Geom.Rectangle.Contains(rect, lx, ly)) {
    return new Phaser.Geom.Point(line.x, line.y)
  }

  const startsBelow = rect.centerY <= ly
  const startsLeft = lx < rect.centerX

  const horizLine = startsBelow ? rect.getLineC() : rect.getLineA()
  const vertLine = startsLeft ? rect.getLineD() : rect.getLineB()

  // TODO: I believe this can be optimized into not needing to run two
  // intersections for all cases
  const hIntersect = new Phaser.Geom.Point()
  const vIntersect = new Phaser.Geom.Point()

  const hasH = Phaser.Geom.Intersects.LineToLine(line, horizLine, hIntersect)
  const hasV = Phaser.Geom.Intersects.LineToLine(line, vertLine, vIntersect)

  if (hasH && hasV) {
    const distH = Phaser.Math.Distance.Between(
      hIntersect.x, hIntersect.y,
      lx, ly
    )
    const distV = Phaser.Math.Distance.Between(
      vIntersect.x, vIntersect.y,
      lx, ly
    )
    if (distH < distV) {
      return hIntersect
    }
    return vIntersect
  }

  if (hasH) {
    return hIntersect
  }
  if (hasV) {
    return vIntersect
  }

  if (printErrors) {
    /* eslint-disable no-console */
    console.error(line)
    console.error(rect)
    console.error('Unable to determine intersection.')
    /* eslint-enable no-console */
  }
  return null
}

export default intersectRect