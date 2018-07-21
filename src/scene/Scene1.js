import drawMask from '../util/drawMask'
console.log(drawMask)

const Name = 'scene1'

class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: Name })
  }

  init() {}

  preload() {}

  create() {
    this.walls = [
      new Phaser.Geom.Rectangle(50, 300, 100, 100),
      new Phaser.Geom.Rectangle(70, 300, 200, 10),
      new Phaser.Geom.Rectangle(400, 300, 100, 75),
      new Phaser.Geom.Rectangle(300, 400, 80, 90),
      new Phaser.Geom.Rectangle(200, 200, 120, 15),
      new Phaser.Geom.Rectangle(350, 200, 80, 15),
      new Phaser.Geom.Rectangle(500, 120, 15, 100),
      new Phaser.Geom.Rectangle(550, 250, 15, 100),
      new Phaser.Geom.Rectangle(600, 370, 15, 100),
    ]

    const wallG = this.add.graphics()
    wallG.fillStyle(0x00ff00)

    this.walls.forEach(w => {
      wallG.fillRectShape(w)
    })

    this.g = this.add.graphics()

    this.cx = null
    this.cy = null
    this.input.on('pointermove', (ptr) => {
      this.cx = ptr.x
      this.cy = ptr.y
    })
  }

  update() {
    if (this.cy && this.cy) {
      this.g.clear()
      drawMask(this.cx, this.cy, 1, 200, this.walls, this.g)
    }
  }
}

Scene1.Name = Name

export default Scene1