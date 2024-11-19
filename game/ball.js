import * as THREE from 'three'
import { Obj } from './obj.js'
import { getLineLen, line2D } from './line.js'

const _PI_ = 3.14159265358979323846

export function boxCollision({ box1, box2 }) {
  const xCollision = box1.right > box2.left && box1.left < box2.right
  const yCollision = box1.bottom + box1.velocity.y < box2.top && box1.top > box2.bottom
  const zCollision = box1.front > box2.back && box1.back < box2.front
  if (zCollision && yCollision && xCollision) {
    //console.log(box1.position.x > box2.position.x ? "right" : "left")
    //console.log(box1.position.z > box2.position.z ? "buttom" : "top")
  }
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
  // line
    this.line1 = null
    this.line2 = null
    this.line3 = null
    this.line4 = null
    this.star = null
    this.starColor = null
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
    // set the side it need to check 
    this.L_R =     this.velocity.x < 0;
    this.up_down = this.velocity.z < 0;
  }

  setAngleOnHit(x ,y) {
    const end = (y - x) + 90
    //this.angle = end //((end > 0) ? (end > 360 ? end - 360 : end) : end)
    this.angle = ((end <= 0 ? end + 360 : end)) // probably don't need that much
    this.AngleToVelocity(this.angle)
  }
  applyGravity(player) {
    this.updateSides()
    if (this.position.x >= this.gameSize && !this.L_R) { this.setAngleOnHit(this.angle , -90) }
    else if (this.position.x <= (-this.gameSize) && this.L_R) { this.setAngleOnHit(this.angle , -90) } 
    if ( boxCollision({ box1: this, box2: player })) {
      if (this.line1) { this.line1.rm() }
      if (this.line2) { this.line2.rm() }
      if (this.line3) { this.line3.rm() }
      if (this.line4) { this.line4.rm() }
      this.line1 = new line2D(player.position.x + player.width / 2, player.position.y + player.height / 2 ,this.position.z, player.position.x + player.width / 2, player.position.y + player.height / 2 ,this.position.z < player.position.z ? player.position.z + player.depth / 2 : player.position.z - player.depth / 2)
      this.line2 = new line2D(this.position.x, player.position.y + player.height / 2, player.position.z + player.depth / 2, this.position.x < player.position.x ? player.position.x + player.width / 2 : player.position.x - player.width / 2, player.position.y + player.height / 2, player.position.z + player.depth / 2)
      //> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - <//
      this.line3 = new line2D(player.position.x - player.width / 2 , player.position.y + player.height / 2 , player.position.z - player.depth / 2, player.position.x + player.width / 2, player.position.y + player.height / 2, player.position.z - player.depth / 2)
      this.line4 = new line2D(player.position.x - player.width / 2 , player.position.y + player.height / 2 , player.position.z - player.depth / 2, player.position.x - player.width / 2, player.position.y + player.height / 2, player.position.z + player.depth / 2)
    //* //
      this.line1.setColor('green')
      this.line2.setColor('pink') // ==== this one 
      this.line3.setColor('orange')
      this.line4.setColor('purple')
      this.line1.DrawLine()
      this.line2.DrawLine()
      this.line3.DrawLine()
      this.line4.DrawLine()
    //* Draw line -  //
      //console.log(player.width, player.depth)
      const len  = this.line4.getLen() - this.line1.getLen() - (this.width)
      const len2 = this.line3.getLen() - this.line2.getLen() - (this.width)
    // get line diff
      const influance = ((player.velocity.x + player.velocity.z) *  20)  // use z and x for all the paddles
      //- this.AngleToVelocity(this.angle)
      //? const res = new THREE.Vector2(Math.sin(this.angle * (_PI_ /180.0)), Math.cos(this.angle * (_PI_ /180.0)))
      //? res.normalize()
      //? console.log(this.velocity)
      //? console.log(this.angle)
      //this.speed = 0.0
      //! dot = x1*x2 + y1*y2      # dot product
      //! det = x1*y2 - y1*x2      # determinant
      //! angle = atan2(det, dot)  # atan2(y, x) or atan2(sin, cos)
      const dot = player.position.x * player.position.z + this.position.x * this.position.z
      const det = player.position.x * player.position.z - this.position.x * this.position.z
      const colangle =  Math.atan2(det, dot)
      const res = new THREE.Vector2 (Math.sin(colangle * (_PI_ /180.0)), Math.cos(colangle * ( _PI_ /180.0)))
      res.normalize()
      //console.log(res)
      const err = this.width / 2
      if      (((player.velocity.x > 0 && this.velocity.x > 0) || (player.velocity.x < 0 && this.velocity.x < 0)) && len2 > len && len2 > this.width + err) {
        //this.position.x += 
        console.log("ici")
      }
      else if (((player.velocity.z > 0 && this.velocity.z > 0) || (player.velocity.z < 0 && this.velocity.z < 0)) && len > len2 && len  > this.width + err) {
        //this.position.z += 1
        console.log("ici2")
      }
      //else
      //this.angle = colangle
      console.log(res)
      console.log(this.velocity)
          //console.log(colangle)
      this.setAngleOnHit(this.angle + colangle, len < len2 ? 90 : -90) /* //>  - - - - - -*/
          //this.angle += (colangle * 3)
          //console.log(colangle)
      //* if      (((paddleVel.y > 0 && copy.y > 0) || (paddleVel.y < 0 && copy.y < 0)) && len > len2 && len + err > (BallSize / 2)) {
      //*   y += ((paddleVel.y * paddle_speed ) + (speed * copy.y));
      //* }
      //* else if (((paddleVel.x > 0 && copy.x > 0) || (paddleVel.x < 0 && copy.x < 0)) && len2 > len && len2 + err > (BallSize / 2)) {
      //*   x += ((paddleVel.x * paddle_speed ) + (speed * copy.x));
      //* }
      //* else {
        //*   round = newR + paddleVel.x + paddleVel.y;
        //* }
      }
  }
  setGameSize(size) {
    this.gameSize = size / 2
  }
  makeLineStar() {
    if (this.star)
      this.star.rm()
    this.star = new line2D(this.position.x, this.position.y, this.position.z, this.position.x , this.position.y - 10, this.position.z)
    if (!this.starColor)
      this.starColor = this.star.setRendColor()
    this.star.setColor(this.starColor)
    this.star.DrawLine()
  }
  getWall() {
    return super.getWall()
  }

  setWall(d) {
    super.setWall(d)
  }

  kill() {
  if (this.star)
      this.star.rm()
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