import * as THREE from 'three'
import { Obj } from './obj.js'

export function boxCollision({ box1, box2 }) {
  const xCollision = box1.right >= box2.left && box1.left <= box2.right
  const yCollision = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom
  const zCollision = box1.front >= box2.back && box1.back <= box2.front

  return xCollision && yCollision && zCollision
}

export class ball extends Obj {
  constructor({
    width,
    height,
    depth,
    color = '#0369a1',
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
    Geometry = new THREE.SphereGeometry(width / 2),
  }) {
    super(width,
      height,
      depth,
      color,
      velocity,
      position,
      zAcceleration,
      Geometry
  )
    this.gameSize = 10
    this.speedX = 0
    this.speedZ = 0
    this.Geometry = Geometry
    this.width = width
    this.height = height
    this.depth = depth

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

  update() {
    this.updateSides()

    this.position.x += this.velocity.x * this.speedX
    this.position.z += this.velocity.z * this.speedZ
  }
  setSpeed(_x, _z) {
    this.speedX = _x
    this.speedZ = _z
  }
  playerPoin() {
    let p = 0
    if (this.position.z < -this.gameSize * 2 || this.position.z > this.gameSize * 2) {
      p = Number(this.position.z)
      this.position.z = 0
      this.position.x = 0
    }
    return p
  }

  applyGravity(player) {
    if (this.position.x >= this.gameSize) {
      this.velocity.x = -1
      this.position.x = this.gameSize
    }
    else if (this.position.x <= (-this.gameSize)) {
      this.velocity.x = 1
      this.position.x = -this.gameSize
    } 
    if (
      boxCollision({
        box1: this,
        box2: player
      })
    ) {
      if (this.position.z > 0) {
        this.velocity.z = -1
      }
      else {
        this.velocity.z = 1
      }
      if (player.velocity.x != 0) {
        if (player.velocity.x > this.velocity.x)
          this.velocity.x = -1
        else
          this.velocity.x = 1
      }
      const xDist = this.position.x - player.position.x
      const zDist = this.position.z - player.position.z
      const angle = Math.atan2(zDist, xDist) * 180 / Math.PI
      console.log(angle)
      //this.speedX = angle
    }
  }
  setGameSize(size) {
    this.gameSize = size / 2
  }
  kill() {
    super.kill()
  }
}

//!    let posAvatar = new THREE.Vector3();
//?    avatar.getWorldPosition(posAvatar);
//todo    
//*    let posObj = new THREE.Vector3();
//~   obj.getWorldPosition(posObj);
//+   
//-    const xDist = posObj.x - posAvatar.x;
//>    const zDist = posObj.z - posAvatar.z;
//    const angle = Math.atan2(zDist, xDist) * 180 / Math.PI;
//    
//    avatar.rotation.y = angle;