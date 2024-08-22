import * as THREE from 'three'
import { Box } from './box.js'
import { scene, camera, Draw } from './render.js'
import { keys } from './keybord.js'
import { initMenu } from './menu.js'
import { Text } from './text.js'
import { ball } from './ball.js'


let   Round       =  0
let   GameSize    =  15
let   PlayerSpeed =  0.15
let   Players     = []
let   Map         = []
let   Ball        = []
let   BallSpeedX  =  0.02
let   BallSpeedZ  =  0.02
let   Light       = []
let   Amlight     = []
let   GameText    = []

let GameLoop = 1

export function initGame(gamesize) {
  GameLoop = 1
  keys.space.pressed = false
  GameSize = gamesize
  PlayerSpeed = 0.15
  Round = 0
  Map[0] = new Box({
    width: GameSize,
    height: 0.5,
    depth: GameSize,
    color: '#0369a1',
    position: {
      x: 0,
      y: -2,
      z: 0
    }
  })
  // player
  Players[0] = new Box({
    width: 2,
    height: 0.4,
    depth: 0.4,
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position: {
      x: 0,
      y: 0.5,
      z: (GameSize / 2) - (0.5 / 2)
    }
  })
  
  Players[1] = new Box({
    width: 2,
    height: 0.4,
    depth: 0.3,
    color: 'red',
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position: {
      x: 0,
      y: 0.5,
      z: ((GameSize / 2) * - 1 ) + (0.5 / 2)
    }
  })
  //
  Light[0] = new THREE.DirectionalLight(0xffffff, 1)
  Light[0].position.y = 3
  Light[0].position.z = 1
  Light[0].castShadow = true
  Amlight = new THREE.AmbientLight(0xffffff, 0.5)
  //
  Light.forEach(light => {
    light.castShadow = true
    scene.add(light)
  })
  //
  Players.forEach(player => {
    player.castShadow = true
    scene.add(player)
  })
  //
  Map.forEach(obj => {
    obj.receiveShadow = true
    scene.add(obj)
  })
  camera.position.set(Map[0].position.x / 2, Map[0].position.y + GameSize, Map[0].position.z / 2)
  camera.lookAt(Map[0].position)
  // name
  GameText[0] = new Text(scene, {x:0,y:0,z:0}, 'Løsted', 'pink')
  GameText[1] = new Text(scene, {x:0,y:0,z:0}, 'pierre', 'lightseagreen')
  GameText[0].rotate(-90,0,0)
  GameText[1].rotate(-90,0,0)
  // ball
  Ball[0] = new ball({
    width: 0.4,
    height: 0.4,
    depth: 0.4,
    color: 'purple',
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
  position:{
      x: 0,
      y: -1.5,
      z: 0
    }})
  Ball.forEach(obj => {
    obj.setSpeed(0.10, 0.10)
    obj.velocity.x = 1
    obj.velocity.z = 1
    obj.setGameSize(gamesize)
    scene.add(obj)
  })
  Gaming()
}

function LeaveGame() {
  GameLoop = false

  Players.forEach(player => {
    scene.remove(player)
  })
  Map.forEach(obj => {
    scene.remove(obj)
  })
  Light.forEach(light => {
    scene.remove(light)
  })
  scene.remove(Amlight)
  GameText.forEach(txt => {
    txt.kill()
  })
  Ball.forEach(obj => {
    scene.remove(obj)
  })
}

function Gaming() {
  if (GameLoop) {
    Draw()
    requestAnimationFrame(Gaming)
  }
  else {
    initMenu()
    return
  }
  GameText[0].move(Players[1].position.x, Players[1].position.y + 1, Players[1].position.z - 0.5)
  GameText[1].move(Players[0].position.x, Players[0].position.y + 1, Players[0].position.z + 0.5)
  GameText.forEach(txt => {
    txt.rotate(THREE.MathUtils.radToDeg(camera.rotation.x), 
              THREE.MathUtils.radToDeg(camera.rotation.y), 
              THREE.MathUtils.radToDeg(camera.rotation.z))
  })
  //
  //let ing = Math.atan2(Players[1].position.y - Players[0].position.y , Players[1].position.x - Players[0].position.x)
  //camera.rotation.z = ing

  Ball.forEach(b => {
    //b.velocity.z
    //b.velocity.x
    Players.forEach(p => {
      b.applyGravity(p)
    })
    b.update()
  })

  if (keys.k.pressed) {
    LeaveGame()
    console.log("a")
  }
  Players.forEach(player => {
    player.velocity.x = 0
  })
  // control
  if (keys.a.pressed && Players[0].position.x >
    (GameSize / 2) * -1 + (Players[0].width / 2)) {
   Players[0].velocity.x = PlayerSpeed * -1
  }
  else if (keys.d.pressed && Players[0].position.x <
    (GameSize / 2) - (Players[0].width / 2)) {
    Players[0].velocity.x = PlayerSpeed
  }
  if (keys.left.pressed && Players[1].position.x >
    (GameSize / 2) * -1 + (Players[1].width / 2)) {
   Players[1].velocity.x = PlayerSpeed * -1
  }
  else if (keys.right.pressed && Players[1].position.x <
    (GameSize / 2) - (Players[1].width / 2)) {
    Players[1].velocity.x = PlayerSpeed
  }
    Players.forEach((player) => {
    player.update(Map[0])
  })
}


// > call menu here