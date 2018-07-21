import intersectRect from './intersectRect'

const degToRad = d => d * 3.14158 / 180

const defaultOpts = {
  stepDeg: 10,
}

const radCache = new Map()
const getRad = n => {
  if (radCache.has(n)) {
    return radCache.get(n)
  }
  // compute radians then trunc with a fixed number of decimals
  const rad = Math.trunc(degToRad(n) * 100000) / 100000
  radCache.set(n, rad)
  return rad
}

const cosCache = new Map()
const sinCache = new Map()

const memoize = (n, fn, c) => {
  const r = getRad(n)
  if (c.has(r)) {
    return c.get(r)
  }

  const v = fn(r)
  c.set(r, v)
  return v
}

const getCos = n => memoize(n, Math.cos, cosCache)
const getSin = n => memoize(n, Math.sin, sinCache)

/**
 * @param {[number, number]} fromPointXY a tuple with the coordinates that
 *    we're casting from
 * @param {number} castDistance how far we want to check for collisons
 * @param {Phaser.Geom.Rectangle[]} wallRects the collection of walls that we
 *    could collide with
 * @param {AroundOpts} aroundOpts options for this call: `stepDeg` in
 *    the number of degrees between each cast and defaults to 10, `outPoints`
 *    is a collection of points that will be returned to minimize garbage
 *    creation
 * @returns {null | Phaser.Geom.Point[]} null if no walls are within
 *    castDistance, Math.trunc(360 / castDistance) points of collision
 *    surrounding fromPointXY if at least one wall is collidable.
 */
const raycast = (
  fromPointXY,
  castDistance,
  wallRects,
  aroundOpts = null
) => {
  const opts = aroundOpts || defaultOpts
  const { stepDeg } = opts
  if (!stepDeg) {
    throw new Error('Called around without specifying step degree')
  }

  const [cx, cy] = fromPointXY
  const castCircle = new Phaser.Geom.Circle(cx, cy, castDistance)
  const wallFilter = wallRects.filter(r =>
    Phaser.Geom.Intersects.CircleToRectangle(castCircle, r)
  )

  if (!wallFilter.length) {
    return null
  }

  if (wallFilter.some(w => Phaser.Geom.Rectangle.Contains(w, cx, cy))) {
    return []
  }
  const results = []

  const n = Math.trunc(360 / stepDeg)
  const castLn = new Phaser.Geom.Line()

  for (let i = 0; i < n; i++) {
    const newDeg = stepDeg * i
    const x = Math.round(castDistance * getCos(newDeg))
    const y = Math.round(castDistance * getSin(newDeg))
    const dx = cx + x
    const dy = cy + y
    castLn.setTo(cx, cy, dx, dy)

    let closestPt = new Phaser.Geom.Point(dx, dy)
    let closestDist = castDistance

    let outPt = null
    wallFilter.forEach((w) => {
      outPt = intersectRect(castLn, w)
      if (outPt) {
        const newDist = Phaser.Math.Distance.Between(cx, cy, outPt.x, outPt.y)
        if (closestPt === null || closestDist > newDist) {
          closestPt = outPt
          closestDist = newDist
        }
      }
    })
    results.push(closestPt)
  }

  return results
}

export default raycast