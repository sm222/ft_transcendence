import * as THREE from 'three'
import { scene, camera, Draw, SetCamMode } from './render.js'
import { Box } from         './box.js'
import { keys } from        './keybord.js'
import { Text } from        './text.js'
import { ball } from        './ball.js'
import { MODEL3D } from     './Import3D.js'
import { endScore} from     './endGame.js'
import { initEndGame } from './endGame.js'

import { GameData   } from './gameSetting.js'
import { Tournament } from './tournament.js'

const Second        =  60
const FirstPause    =  (Second * 5)

const PauseTimeDef  =  (Second * 3) // time in frame (asuming it run a 60fps) wait 3 sec
const BestOf        =  5            // exp: 3, 2 round to win

const BallSpeedUp   =  (Second * 5)
let   BallTimer     =  0

let   Round         =  -1
let   Pause         =  true
let   PauseTime     =  FirstPause
let   GameSize      =  15
let   PlayerSpeed   =  0.15
let   BallSpeed     =  0.09
let   ScoreValue    =  []

let   Players       =  []
let   Map           =  []
let   Ball          =  []
let   Trees         =  []
let   Snow          =  null
let   GameTextScore =  null

let   Light         =  []
let   Amlight       =  []
let   GameText      =  []
let   WinRound      =  0

let   GameLoop      =  1

let   endCamX       =  0

const AiNames       = ['GLaDOS', 'HAL 9000', 'AUTO', 'Cylons', 'Ava', 'Samantha']
let   time          =  0

const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament

function rand(max) {
  return Math.floor(Math.random() * max)
}

function getAiName() {
  return AiNames[rand(6)]
}

async function makeTrees(gamesize) {
  let k = 0
  for (let i = -gamesize; i < gamesize; i++) {
    for (let j = -gamesize; j < gamesize; j++) {
      const newI = i * rand(10)
      const newJ = j * rand(10)
      if ((newI < -gamesize || newI > gamesize) || (newJ < -gamesize || newJ > gamesize)) {
        Trees[k] = new MODEL3D(scene, {x:newI , y:-3, z:newJ}, [5,rand(5) + 5 ,5])
        const mid = 10
        const v = rand(mid * 2)
        Trees[k].rotate( v >= mid ? -v + mid : v, 0 , v >= mid ? -v + mid : v)
        k++
      }
    }
  }
}

export async function initGameAi(gamedata, tournamentdata) {
  newGamedata.copy(gamedata)
  newTrounemanData.copy(tournamentdata)
  newGamedata.resetTime()
  newGamedata.setEndGame(initEndGame)
  endCamX = 0
  newGamedata.setName(getAiName(), 1)
  newGamedata._Clock.start()
  await makeTrees(newGamedata._GameSize)
  Round = -1
  GameLoop = 1
  PauseTime = FirstPause
  Pause = true
  ScoreValue[0] = 0 // score
  ScoreValue[1] = 0 // score
  GameSize = newGamedata._GameSize
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
  Snow = new Box({
    width: GameSize * 25,
    height: 0.5,
    depth: GameSize * 25,
    color: '#3d3e40',
    position: {
      x: 0,
      y: -6,
      z: 0
    },
    zAcceleration:false,
    opacity:1,
    transparent: false
  })
  // player
  Players[0] = new Box({
    width: 2,
    height: 0.4,
    depth: 0.4,
    color: newGamedata.getPlayerColor(0),
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
    color: newGamedata.getPlayerColor(1),
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
  Light[0] = new THREE.DirectionalLight(0xffffff, 2)
  Light[0].position.y = 6
  Amlight = new THREE.AmbientLight(0xffffff, 1)
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
    //obj.receiveShadow = true
    scene.add(obj)
  })
  Snow.receiveShadow = true
  scene.add(Snow)
  //
  camera.position.set(Map[0].position.x / 2, Map[0].position.y + GameSize, Map[0].position.z / 2)
  camera.lookAt(Map[0].position)
  // name
  GameText[0] = new Text(scene, {x:0,y:0,z:0}, newGamedata.getName(1) , newGamedata.getPlayerNameColor(1))
  GameText[1] = new Text(scene, {x:0,y:0,z:0}, newGamedata.getName(0) , newGamedata.getPlayerNameColor(0))
  GameText[0].rotate(-90,0,0)
  GameText[1].rotate(-90,0,0)
  GameTextScore = new Text(scene, {x:0,y:-4,z:-1.5}, '0:0', 'yellow')

  // ball
  Ball[0] = new ball({
    width: 0.4,
    height: 0.4,
    depth: 0.4,
    color: 'orange',
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position:{
      x: 0,
      y: -1.5,
      z: 0
    },
    zAcceleration: false,
    transparent: true,
    opacity: 0.8
  })
  Ball.forEach(obj => {
    obj.setSpeed(BallSpeed, BallSpeed)
    obj.angle = (rand(360))
    obj.castShadow = true
    obj.setGameSize(newGamedata._GameSize)
    scene.add(obj)
  })
  GamingAi()
}

async function LeaveGame() {
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
  Trees.forEach(obj => {
    obj.kill()
  })
  GameTextScore.kill()
  scene.remove(Snow)
  Snow.kill()
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
    Ball[0].setSpeed(BallSpeed)
    if (WinRound > 0)
      ScoreValue[1]++
    else
      ScoreValue[0]++
    Round++
  }
  GameTextScore.updateSize(2, 0.4, 12)
  GameTextScore.updateTxt(String(ScoreValue[1] + '\n' + ScoreValue[0]))
  if (ScoreValue[0] >= BestOf / 2 || ScoreValue[1] >= BestOf / 2) {
    newGamedata.setEndScore(ScoreValue)
    GameLoop = 2
    return 2
  }
  return 0
}

function moveText() {
  GameTextScore.rotate(THREE.MathUtils.radToDeg(camera.rotation.x), THREE.MathUtils.radToDeg(camera.rotation.y), THREE.MathUtils.radToDeg(camera.rotation.z))
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
  if (newGamedata._keybordMode) {
    if (noGame) {
      Players.forEach((player) => { player.update(Map[0])})
      Players.forEach(p => {p.position.x = 0})
      return
    }
    if (keys.a.pressed && Players[0].position.x >
    (GameSize / 2) * -1 + (Players[0].width / 2)) {
      Players[0].velocity.x = PlayerSpeed * -1
    }
    else if (keys.d.pressed && Players[0].position.x < (GameSize / 2) - (Players[0].width / 2)) { 
      Players[0].velocity.x = PlayerSpeed }
    /*
    if (keys.left.pressed && Players[1].position.x > (GameSize / 2) * -1 + (Players[1].width / 2)) {
      Players[1].velocity.x = PlayerSpeed * -1
    }
    else if (keys.right.pressed && Players[1].position.x < (GameSize / 2) - (Players[1].width / 2)) {
        Players[1].velocity.x = PlayerSpeed
    }
    */
    const deadzone = 1.2
    time += newGamedata._Clock.getDelta()
    console.log(time)
    if (time >= 1 && (Players[1].position.x + deadzone < Ball[0].position.x || Players[1].position.x + -deadzone > Ball[0].position.x)) {
      time = 0
      if (Players[1].position.x > -(GameSize / 2) + (Players[1].width / 2) && Ball[0].position.x < Players[1].position.x ) {
        Players[1].velocity.x =  -PlayerSpeed
      }
      if (Players[1].position.x < (GameSize / 2)  - (Players[1].width / 2) && Ball[0].position.x > Players[1].position.x) {
        Players[1].velocity.x =  PlayerSpeed
      }
    }
    Players.forEach((player) => { player.update(Map[0])})
  }
}


// funny
function moveTrees(gamesize) {
  Trees.forEach(tree => {
    const newI = tree.position.x += (rand(gamesize) * rand(2) ? 1 : -1)
    const newJ = tree.position.z += (rand(gamesize) * rand(2) ? 1 : -1)
    if ((newI < -gamesize || newI > gamesize) || (newJ < -gamesize || newJ > gamesize)) {
      tree.move(newI , -3, newJ)
    }
  })
}

function selecWin(score) {
  return Boolean(score[1] > score[0])
}

async function GamingAi() {
  let end = 0
  keybordGame(Pause)
  moveText()
  if (!Pause && GameLoop != 2) {
    end = score()
    if (BallTimer == BallSpeedUp) {
      BallTimer = 0
      Ball[0].speed += 0.01
    }
    BallTimer++
    newGamedata.TickTime()
    SetCamMode(true)
  }
  else if (GameLoop != 2) {
    let timer = 0
    PauseTime--
    if (Round === -1) {
      SetCamMode(false)
      camera.position.set(Map[0].position.x / 2, Map[0].position.y + GameSize + (PauseTime / 2), Map[0].position.z / 2)
      camera.setFocalLength(10 + PauseTime / 10)
      camera.lookAt(Map[0].position)
      camera.rotateZ(PauseTime / 190)
      camera.rotateY(PauseTime / 200)
    }
    for (let index = PauseTime; index > 0; index -= 60) { timer++ }
      GameTextScore.updateSize(2, 0.4, 12)
      GameTextScore.updateTxt(String(timer))
      if (PauseTime == 0) {
        const ballStartR = rand(4)
        Ball[0].angle = ballStartR >= 2 ? 0 : 180
        const LR = rand(4)
        Ball[0].angle += LR >= 2 ? 45 : -45
        Pause = false
        PauseTime = PauseTimeDef
    }
  }
  if (keys.k.pressed || end == 1 ) { LeaveGame() }
  //if (keys.space.pressed) { moveTrees(10) }
  Players.forEach(player => {
    player.velocity.x = 0
  })
  if (GameLoop == 2) {
    SetCamMode(false)
    camera.position.y += 1
    camera.rotateX(endCamX / 200)
    endCamX += 0.05
    if (ScoreValue[0] == 0 || ScoreValue[1] == 0) { moveTrees(10) } // funny egg
    if (endCamX > 6) {
      GameLoop = 0
      await LeaveGame()
    }
  }
  if (GameLoop) {
    Draw()
    requestAnimationFrame(GamingAi)
  }
  else {
    // end of the game here
    const win =  Number(selecWin(ScoreValue))
    newTrounemanData._roundWiner.push([
      newGamedata.getName(win),
      newGamedata.getPlayerColor(win),
      newGamedata.getPlayerNameColor(win)])
    const ft = newGamedata.getEndGame()
    newGamedata.setEndScore(ScoreValue)
    ft(newGamedata, newTrounemanData)
    return
  }
}
