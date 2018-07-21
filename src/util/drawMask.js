import raycast from './raycast'

/**
 * @param {number} cx the x-axis center point we start casting from
 * @param {number} cy the y-axis center point to start casting from
 * @param {number} castDeg the numbers of degrees between each ray cast
 * @param {number} castDist how far should we be masking line of sight
 * @param {Phaser.Geom.Rectangle[]} walls the walls that will occlude light
 * @param {Phaser.GameObjects.Graphics} stencil stencil being used to mask
 *  line of sight; will not be cleared by this code
 */
const drawMask = (
  cx, cy,
  castDeg,
  castDist,
  walls,
  stencil
) => {
  const points = raycast([cx, cy], castDist, walls, { stepDeg: castDeg })
  stencil.fillStyle(0xf8fc83, 0.25)
  if (!points) {
    stencil.fillCircle(cx, cy, castDist)
  } else {
    for (let i = 0; i < points.length; i++) {
      const ni = (i + 1) % points.length
      stencil.fillTriangle(
        cx, cy,
        points[i].x, points[i].y,
        points[ni].x, points[ni].y
      )
    }
  }
}

export default drawMask