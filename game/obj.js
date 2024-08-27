import * as THREE from 'three'


export function objCollision({ obj1, obj2 }) {
  const xCollision = obj1.right >= obj2.left && obj1.left <= obj2.right
  const yCollision = obj1.bottom + obj1.velocity.y <= obj2.top && obj1.top >= obj2.bottom
  const zCollision = obj1.front >= obj2.back && obj1.back <= obj2.front

  return xCollision && yCollision && zCollision
}

export class Obj extends THREE.Mesh {
  constructor(
    width,
    height,
    depth,
    color = '#00ff00',
    velocity = {
      x: 0,
      y: 0,
      z: 0
    },
    position = {
      x: 0,
      y: 0,
      z: 0
    },
    zAcceleration = false,
    Geometry = new THREE.BoxGeometry(width, height, depth),
    Mat      = new THREE.MeshStandardMaterial({ color })
  ) {
      super(
        Geometry,
        Mat
      )
    this.Geometry = Geometry
    this.Material = Mat
    this.width    = width
    this.height   = height
    this.depth    = depth

    this.position.set(position.x, position.y, position.z)

    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2

    this.velocity = velocity
    this.gravity = -0.002

    this.zAcceleration = zAcceleration
  }

  updateSides() {
    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2
  }

  update(ground) {
    this.updateSides()

    if (this.zAcceleration) 
      this.velocity.z += 0.0003
    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
    this.applyGravity(ground)
  }

  applyGravity(ground) {
    this.velocity.y += this.gravity

    // this is where we hit the ground
    if (objCollision({obj1: this, obj2: ground })) {
      const friction = 0.5
      this.velocity.y *= friction
      this.velocity.y = -this.velocity.y
    } else
      this.position.y += this.velocity.y
  }

  kill() {
    this.Geometry.dispose()
    this.Material.dispose()
  }
}