import * as THREE from 'three'
import { Box } from './box.js'
import { scene, camera, renderer, Draw } from './render.js'
import { keys, KeyBordinput } from './keybord.js'
import { initMenu } from './menu.js'

let   Round = 0
let   Mode  = 0
let   GameSize = 15
let   PlayerSpeed = 0.15
let   Players = []
let   Map     = []
let   Ball    = []
let   Light   = []
let   Amlight

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
  //
  //let ing = Math.atan2(Players[1].position.y - Players[0].position.y , Players[1].position.x - Players[0].position.x)
  //camera.rotation.z = ing
  if (keys.k.pressed) {
    LeaveGame()
    console.log("a")
  }
  Players.forEach(player => {
    player.velocity.x = 0
  })
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