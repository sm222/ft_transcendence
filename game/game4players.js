import * as THREE from 'three'
import { scene, camera, Draw, SetCamMode } from './render.js'
import { Box } from         './box.js'
import { keys } from        './keybord.js'
import { Text } from        './text.js'
import { ball } from        './ball.js'
import { MODEL3D } from     './Import3D.js'
import { initEndGame } from './endGame.js'
import { getLineLen, line3D } from './line.js'

import { GameData   } from './gameSetting.js'
import { Tournament } from './tournament.js'

const Second        =  60
const FirstPause    =  (Second * 5)

const PauseTimeDef  =  (Second * 3) // time in frame (asuming it run a 60fps) wait 3 sec
const BestOf        =  5            // exp: 3, 2 round to win

const BallSpeedUp   =  (Second * 5)
let   BallTimer     =  0

const paddlesize    =  2
const padddeth      =  0.5

let   Round         =  -1
let   Pause         =  true
let   PauseTime     =  FirstPause
let   GameSize      =  15
let   PlayerSpeed   =  0.15
let   BallSpeed     =  0.01
let   ScoreValue    =  []

let   Lines         =  []

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
// 4 players
let   NbLifes       =  3
let   Lifes         =  []

let   GameLoop      =  1

let   endCamX       =  0

const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament


function rand(max) {
  return Math.floor(Math.random() * max)
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

function makeLine(index) {
  switch (index) {
    case 0:
      return (new line3D(padddeth + -newGamedata._GameSize / 2, -1.2, -newGamedata._GameSize / 2 + padddeth, 
        -padddeth + newGamedata._GameSize / 2, -1.2, -newGamedata._GameSize / 2 + padddeth))
    case 1:
      return (new line3D(padddeth + -newGamedata._GameSize / 2, -1.2, newGamedata._GameSize / 2 - padddeth, 
        -padddeth + newGamedata._GameSize / 2, -1.2, newGamedata._GameSize / 2 - padddeth))
    case 2:
        return (new line3D(padddeth + -newGamedata._GameSize / 2, -1.2, newGamedata._GameSize / 2 - padddeth, 
          padddeth + -newGamedata._GameSize / 2, -1.2, -newGamedata._GameSize / 2 - -padddeth))
    case 3:
        return (new line3D(-padddeth + newGamedata._GameSize / 2, -1.2, newGamedata._GameSize / 2 - padddeth, 
          -padddeth + newGamedata._GameSize / 2, -1.2, -newGamedata._GameSize / 2 - -padddeth))
    default:
      break;
  }
}

export async function initGame4player(gamedata, tournamentdata) {
  newGamedata.copy(gamedata)
  newTrounemanData.copy(tournamentdata)
  newGamedata.resetTime()
  newGamedata.setEndGame(initEndGame)
  endCamX = 0
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
    width: GameSize * 100,
    height: 0.5,
    depth: GameSize * 100,
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
    width: paddlesize,
    height: 0.4,
    depth: padddeth,
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
    width: paddlesize,
    height: 0.4,
    depth: padddeth,
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
  // - // - // - // - // - // - //
  Players[2] = new Box({
    width: padddeth,
    height: 0.3,
    depth: paddlesize,
    color: newGamedata.getPlayerColor(1),
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position: {
      x: ((GameSize / 2) * - 1 ) + (0.5 / 2),
      y: 0.5,
      z: 0,
    }
  })
  Players[3] = new Box({
    width: padddeth,
    height: 0.3,
    depth: paddlesize,
    color: newGamedata.getPlayerColor(1),
    velocity: {
      x: 0,
      y: -0.01,
      z: 0
    },
    position: {
      x: ((GameSize / 2) * 1 ) - (0.5 / 2),
      y: 0.5,
      z: 1,
    }
  })
  for (let index = 0; index < 4; index++) { 
    Lifes[index] = NbLifes; 
    Lines[index] = makeLine(index)
  }
  // - // - // - // - // - // - //
  Lines.forEach(line => {
    line.setColor('yellow')
    line.DrawLine()
  });
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
  Map.forEach (obj => {
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
    obj.setSpeed(BallSpeed)
    obj.angle = (rand(360) % 359)
    console.log(obj.angle)
    obj.castShadow = true
    obj.setGameSize(newGamedata._GameSize)
    scene.add(obj)
  })
  Gaming4player()
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
  Lines.forEach(line => {
    line.rm()
  })
}


function score() {
  Ball.forEach(b => {
    if (b.position.x >=  newGamedata._GameSize / 2 && !b.L_R) { b.setAngleOnHit(b.angle, -90)}
    if (b.position.x <= -newGamedata._GameSize / 2 &&  b.L_R) { b.setAngleOnHit(b.angle, -90)}
    if (b.position.z >=  newGamedata._GameSize / 2 && !b.up_down) { b.setAngleOnHit(b.angle, 90)}
    if (b.position.z <= -newGamedata._GameSize / 2 &&  b.up_down) { b.setAngleOnHit(b.angle, 90)}
    Players.forEach(p => {
      b.applyGravity(p)
    })
    b.update()
    //WinRound =  b.playerPoin()
  })
  let hit = 0
  if (Ball[0].position.z < padddeth + -newGamedata._GameSize / 2 && Lifes[1]) {
    Lines[0].rm()
    Lines[0] = makeLine(0)
    Lines[0].setColor('red')
    Lines[0].DrawLine();
    hit = 1;
    Lifes[1]--
  }
  if (Ball[0].position.z > -padddeth + newGamedata._GameSize / 2 && Lifes[0]) {
    Lines[1].rm()
    Lines[1] = makeLine(1)
    Lines[1].setColor('red')
    Lines[1].DrawLine();
    hit = 1;
    Lifes[0]--
    
  }
  if (Ball[0].position.x < -newGamedata._GameSize / 2 + padddeth && Lifes[2]) {
    Lines[2].rm()
    Lines[2] = makeLine(2)
    Lines[2].setColor('red')
    Lines[2].DrawLine();
    hit = 1;
    Lifes[2]--
  }
  if (Ball[0].position.x > newGamedata._GameSize / 2 + -padddeth && Lifes[3]) {
    Lines[3].rm()
    Lines[3] = makeLine(3)
    Lines[3].setColor('red')
    Lines[3].DrawLine();
    hit = 1;
    Lifes[3]--
  }
  if (hit) {
    for (let index = 0; index < 4; index++) {
      if (!Lifes[index]) {
        Players[index].position.x =  0
        Players[index].position.z =  0
        Players[index].position.y = -200000000
      }
    }
    Ball[0].position.z = 0
    Ball[0].position.x = 0
    BallTimer = BallSpeedUp / 2
    Ball[0].speed = 0
  }
  GameTextScore.updateSize(2, 0.4, 12)
  GameTextScore.updateTxt(String(Lifes[0] + ' ' + Lifes[1] + ' ' + Lifes[2] + ' ' + Lifes[3]))
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


function keybordGame(noGame) {
  if (newGamedata._keybordMode) {
    if (noGame) {
      Players.forEach((player) => { player.update(Map[0])})
      for (let index = 0; index < 2; index++) {
        const element = Players[index];
        element.position.x = 0
      }
      return
    }
    if (keys.a.pressed && Players[0].position.x > (GameSize / 2) * -1 + (Players[0].width / 2) + padddeth) {
      Players[0].velocity.x = PlayerSpeed * -1 
    }
    else if (keys.d.pressed && Players[0].position.x < (GameSize / 2) - (Players[0].width / 2) - padddeth) {
      Players[0].velocity.x = PlayerSpeed
    }
    if (keys.left.pressed && Players[1].position.x > (GameSize / 2) * -1 + (Players[1].width / 2) + padddeth) {
      Players[1].velocity.x = PlayerSpeed * -1
    }
    else if (keys.right.pressed && Players[1].position.x < (GameSize / 2) - (Players[1].width / 2) - padddeth) {
        Players[1].velocity.x = PlayerSpeed
    }
    //
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

async function Gaming4player() {
  let end = 0
  keybordGame(Pause)
  moveText()
  if (!Pause && GameLoop != 2) {
    end = 0
    score()
    if (BallTimer == BallSpeedUp) {
      BallTimer = 0
      if (Ball[0].speed == 0) {
        for (let index = 0; index < 4; index++) {
          Lines[index].rm()
          Lines[index] = makeLine(index)
          Lines[index].setColor('yellow')
          Lines[index].DrawLine();
          Ball[0].angle = (rand(360) % 359)
        }
      }
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
      camera.setFocalLength(10 + PauseTime / 10 )
      camera.lookAt(Map[0].position)
      camera.rotateZ(PauseTime / 190)
      camera.rotateY(PauseTime / 200)
    }
    for (let index = PauseTime; index > 0; index -= 60) { timer++ }
      GameTextScore.updateSize(2, 0.4, 12)
      GameTextScore.updateTxt(String(timer))
      if (PauseTime == 0) {
        Ball[0].angle = (rand(360) % 359)
        console.log(Ball[0].angle)
        Pause = false
        PauseTime = PauseTimeDef
    }
  }
  if (keys.k.pressed || end == 1 ) { LeaveGame() }
  //if (keys.space.pressed) { moveTrees(10) }
  Players.forEach(player => {
    player.velocity.x = 0
    player.velocity.z = 0
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
    requestAnimationFrame(Gaming4player)
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
