import * as THREE from 'three'
import { Obj } from './obj.js'

const _PI_ = 3.14159265358979323846

export function boxCollision({ box1, box2 }) {
  const xCollision = box1.right > box2.left && box1.left < box2.right
  const yCollision = box1.bottom + box1.velocity.y < box2.top && box1.top > box2.bottom
  const zCollision = box1.front > box2.back && box1.back < box2.front

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
    opacity = 1,
    transparent = false,
    Geometry = new THREE.SphereGeometry(width / 2),
  }) {
    super(
      width,
      height,
      depth,
      color,
      velocity,
      position,
      zAcceleration,
      opacity,
      transparent,
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
    this.angle = 0
    this.up_down = true
    this.L_R = false
    this.speed = 1
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
    this.AngleToVelocity(this.angle)
    this.position.x += this.velocity.x * this.speed
    this.position.z += this.velocity.z * this.speed
  }
  setSpeed(_speed) {
    this.speed = _speed
  }
  playerPoin() {
    let p = 0
    const dis = 1
    if (this.position.z < -this.gameSize * dis || this.position.z > this.gameSize * dis) {
      p = Number(this.position.z)
      this.position.z = 0
      this.position.x = 0
    }
    return p
  }
  AngleToVelocity(angle) {
    const res = [Math.sin(angle * (_PI_ /180.0)), Math.cos(angle * (_PI_ /180.0))]
    this.velocity.x = res[0]
    this.velocity.z = res[1]
    if (this.velocity.x == 0)
      this.velocity.x = 1
    // set the side it need to check 
    this.L_R =     this.velocity.x < 0;
    this.up_down = this.velocity.z < 0;

  }
  setAngleOnHit(x ,y) {
    const end = (y - x) + 90
    //this.angle = end //((end > 0) ? (end > 360 ? end - 360 : end) : end)
    this.angle = ((end > 0) ? (end > 360 ? end - 360 : end) : (end < 0 ? end + 360 : end)) // probably don't need that much
    this.AngleToVelocity(this.angle)
  }
  applyGravity(player) {
    this.updateSides()
    if (this.position.x >= this.gameSize && !this.L_R) {
      this.setAngleOnHit(this.angle , -90)
    }
    else if (this.position.x <= (-this.gameSize) && this.L_R) {
      this.setAngleOnHit(this.angle , -90)
    } 
    if (
      boxCollision({
        box1: this,
        box2: player
      })
    ) {
      const influance = (player.velocity.x * 20)
      if      (player.position.z > this.position.z && !this.up_down) { this.setAngleOnHit(this.angle , 90) }
      else if (player.position.z < this.position.z &&  this.up_down) { this.setAngleOnHit(this.angle , 90) }
      const resInflu = (player.position.z > 0 ? -influance : influance) // need for the down padle
      if (resInflu + this.angle != 90 || resInflu + this.angle != 270) //! could be a fix
        this.angle += resInflu
      this.AngleToVelocity(this.angle)
      //? console.log(this.velocity)
      //? console.log(this.angle)
    }
  }
  setGameSize(size) {
    this.gameSize = size / 2
  }
  kill() {
    super.kill()
  }
}

/*
* const float r(const float x, const float y) {
*   const float end = (( y - x ) + 90);
*   return ((end > 0) ? (end > 360 ? end - 360 : end) : (end < -360 ? end + 360 : end));
* }
* 
* Vector2 rotate(float angle) {
*   return (Vector2){sin(angle * DEG2RAD), cos(angle * DEG2RAD)};
* }

*/




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