import * as THREE from 'three'
import { Box } from './box.js'
import { scene, camera, Draw } from './render.js'
import { keys } from './keybord.js'
import { initMenu } from './menu.js'
import { Text } from './text.js'
import { ball } from './ball.js'


let   Round        =  -1
let   Pause        =  true
const PauseTimeDef =  60 * 3
let   PauseTime    =  PauseTimeDef
let   GameSize     =  15
let   PlayerSpeed  =  0.15
let   BallSpeed    =  0.04
let   ScoreValue   =  []
let   Players      =  []
let   Map          =  []
let   Ball         =  []
let   Light        =  []
let   Amlight      =  []
let   GameText     =  []
let   WinRound     =  0

let GameLoop = 1


function rand(max) {
  return Math.floor(Math.random() * max)
}

export function initGame(gamesize, 
      p1Name , p1color, 
      p2Name, p2color) {
  Round = -1
  GameLoop = 1
  PauseTime = PauseTimeDef
  Pause = true
  ScoreValue[0] = 0
  ScoreValue[1] = 0
  keys.space.pressed = false
  GameSize = gamesize
  PlayerSpeed = 0.15
  Map[0] = new Box({
    width: GameSize,
    height: 0.5,
    depth: GameSize,
    color: '#0369a1',
    position: {
      x: 0,
      y: -2,
      z: 0
    },
    zAcceleration:true,
    opacity:0.3,
    transparent: true
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
  GameText[0] = new Text(scene, {x:0,y:0,z:0}, p1Name, p1color)
  GameText[1] = new Text(scene, {x:0,y:0,z:0}, p2Name, p2color)
  GameText[0].rotate(-90,0,0)
  GameText[1].rotate(-90,0,0)
  GameText[2] = new Text(scene, {x:0,y:-4,z:-1.5}, '0:0', 'yellow')

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
    obj.setSpeed(BallSpeed, BallSpeed)
    if (rand(2) === 1)
      obj.velocity.x = 1
    else
    obj.velocity.x = -1
    if (rand(2) === 1)
      obj.velocity.z = 1
    else
      obj.velocity.z = -1
    obj.setGameSize(gamesize)
    scene.add(obj)
  })
  console.log(camera.position)
  console.log(camera.rotation)
  Gaming()
}

function LeaveGame() {
  GameLoop = false
  
  Players.forEach(player => {
    scene.remove(player)
    player.kill()
  })
  Map.forEach(obj => {
    scene.remove(obj)
    obj.kill()
  })
  Light.forEach(light => {
    scene.remove(light)
    light.dispose()
  })
  scene.remove(Amlight)
  GameText.forEach(txt => {
    txt.kill()
  })
  Ball.forEach(obj => {
    scene.remove(obj)
    obj.kill()
  })
}


function score() {
  Ball.forEach(b => {
    Players.forEach(p => {
      b.applyGravity(p)
    })
    b.update()
    WinRound =  b.playerPoin()
  })
  if (WinRound !== 0) {
    Pause = true
    console.log(Round)
    Ball[0].setSpeed(BallSpeed, BallSpeed)
    if (WinRound > 0)
      ScoreValue[0]++
    else
      ScoreValue[1]++
    Round++
  }
  GameText[2].updateSize(2, 0.4, 12)
  GameText[2].updateTxt(String(ScoreValue[0] + '\n' + ScoreValue[1]))
  if (WinRound != 0)
    return -1
  return 0
}

function moveText() {
  GameText[0].move(Players[1].position.x, Players[1].position.y + 1, Players[1].position.z - 0.5)
  GameText[1].move(Players[0].position.x, Players[0].position.y + 1, Players[0].position.z + 0.5)
  GameText.forEach(txt => {
    txt.rotate(THREE.MathUtils.radToDeg(camera.rotation.x),
    THREE.MathUtils.radToDeg(camera.rotation.y),
    THREE.MathUtils.radToDeg(camera.rotation.z))
  })
}

// await new Promise(r => setTimeout(r, 1000));

function keybordGame(noGame) {
  if (noGame) {
    Players.forEach((player) => { player.update(Map[0])})
    Players.forEach(p => {p.position.x = 0})
    return
  }
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
  Players.forEach((player) => { player.update(Map[0])})
}


function Gaming() {
  if (!Pause)
    Round = score()
  else {
    PauseTime--
    if (PauseTime == 0) {
      Pause = false
      PauseTime = PauseTimeDef
    }
  }
  keybordGame(Pause)
  moveText()
  //let ing = Math.atan2(Players[1].position.y - Players[0].position.y , Players[1].position.x - Players[0].position.x)
  //camera.rotation.z = ing
  if (keys.k.pressed) {
    LeaveGame()
  }
  Players.forEach(player => {
    player.velocity.x = 0
  })
  if (GameLoop) {
    Draw()
    requestAnimationFrame(Gaming)
  }
  else {
    initMenu()
    return
  }
}


// > call menu here