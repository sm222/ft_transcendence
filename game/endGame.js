import * as THREE from 'three'
import { Box } from './box.js'
import { ball } from './ball.js'
import { scene, camera, Draw, SetCamMode } from './render.js'
import { keys } from './keybord.js'
import { Text } from './text.js'
import { MODEL3D } from './Import3D.js'
//
import { GameData } from './gameSetting.js'
import { Tournament } from './tournament.js'

const  Second            =  60
const  TimerDef          =  (Second * 5)
let    Wait              =  0

export let  endScore     =  [] //! js is such a shit show i hate it

let    Texts             =  []

let    Light             =  []
let    Amlight           =  null

let    Maps              =  []

let    Loop              =  true

let    CamX              =  5

let    endBoard          =  []

const  font              = 'fonts/Ubuntu Light_Bold.json'


const range = 400
const safe = 25

let    Moon              =  null
let    MoonSpin          =  0
let    speed             =  0.01

//"moon" (https://skfb.ly/oFR LK) by RenderX is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament

function rand(max) {
  return Math.floor(Math.random() * max)
}



function nextGame() {
  const PlayersName   = newGamedata.getNames()
  const playersScore  = newGamedata.getEndScore()
  const playersColors = newGamedata.getPlayersNameColor()
  endBoard = [] //! reset endboard
  for (let index = 0; index < PlayersName.length; index++) {
    endBoard.push([playersScore[index], PlayersName[index], playersColors[index]])
  }
  for (let index = 0; index < endBoard.length - 1; index++) {
    if (endBoard[index][0] > endBoard[index + 1][0]) { 
      const tmp = endBoard[index]
      endBoard[index] = endBoard[index + 1]
      endBoard[index + 1] = tmp
      index = -1
    }
  }
  const ofSet = 0
  for (let index = endBoard.length - 1; index > -1; index--) {
    Texts[index + 1] = new Text(scene, {x:ofSet ,y:8,z:-(index * 2)}, String(endBoard[index][1] + ' : ' + endBoard[index][0]), endBoard[index][2], font, 1)
    Texts[index + 1].rotate(-90,0,0)
  }
  const gameTime = newGamedata.getTime()
  Texts.push(new Text(scene, {x:0, y:8, z:4}, String("Time play: m" + gameTime[0] + ":s" + gameTime[1])))
  Texts[Texts.length - 1].rotate(-90,0,0)
  Texts.push(new Text(scene, {x:0,  y:8, z:5}, String("press space to continue")))
  Texts[Texts.length - 1].rotate(-90,0,0)
}

function winer() {
  const PlayersName   = newGamedata.getNames()
  const playersScore  = newGamedata.getEndScore()
  const playersColors = newGamedata.getPlayersNameColor()
  endBoard = [] //! reset endboard
  for (let index = 0; index < PlayersName.length; index++) {
    endBoard.push([playersScore[index], PlayersName[index], playersColors[index]])
  }
  endBoard.sort()
  const ofSet = 0
  Texts.push(new Text(scene, {x:ofSet ,y:8,z:-(5.2)}, String(endBoard[1][1] + ' : ' + endBoard[1][0]), endBoard[1][2], font, 2))
  Texts[Texts.length - 1].rotate(-90,0,0)
  Texts.push(new Text(scene, {x:ofSet ,y:8,z:-(1.2)}, String(endBoard[0][1] + ' : ' + endBoard[0][0]), endBoard[0][2], font, 1))
  Texts[Texts.length - 1].rotate(-90,0,0)
  const gameTime = newGamedata.getTime()
  Texts.push(new Text(scene, {x:0, y:8, z:4}, String("Time play: m" + gameTime[0] + ":s" + gameTime[1])))
  Texts[Texts.length - 1].rotate(-90,0,0)
}

export async function initEndGame(gamedata, tournamentdata)
{
  newGamedata.copy(gamedata)
  newTrounemanData.copy(tournamentdata)
  //

  CamX = 5
  MoonSpin = 0
  speed = 0
  camera.setFocalLength(9)
  camera.position.set(0, 109 ,0)
  Light[0] = new THREE.DirectionalLight(0xffffff, 1)
  Light[0].position.y = 10
  Light[0].position.z = 0
  Amlight = new THREE.AmbientLight(0xffffff, 2)
  Light.forEach(light => {
    light.castShadow = true
    scene.add(light)
  })
  const moonSize = 20
  Moon = new MODEL3D(scene, {x:0 , y:-15, z:0}, [moonSize, moonSize ,moonSize], 'model/moon.glb')
  Maps[0] = new ball({
    width: 1, height: 0.5, depth: 1,
    color: 'darkgray',
    position: { x: 0, y: -10, z: 0 },
    zAcceleration:true, opacity:1, transparent: true
  })

  for (let index = 0; index < 1000; index++) {
    const x = rand(range) - (range / 2)
    const y = rand(range) - (range / 2)
    const z = rand(range) - (range / 2)
    if (/*(y < safe && y > safe * -1) ||*/ (z < safe && z > safe * -1) || (x < safe && x > safe * -1) ) {
      index--
      continue
    }
    Maps.push( new ball({
      width: 1, height: 0.5, depth: 1,
      color: 'white',
      position: { x: x, y: y, z: z },
      zAcceleration:false, opacity:1, transparent: false
    }))
    
  }
  Maps.forEach(obj => {
      obj.receiveShadow = true
      scene.add(obj)
    })
  camera.lookAt(Maps[0].position)
  Loop = true
  camera.rotateX(CamX)
  if (newTrounemanData._totalRound > 2) {
    nextGame()
  }
  else {
    winer()
  }
  EndGameLoop()
}


async function LeaveEndGame() {
  Light.forEach(l =>{
    scene.remove(l)
    l.dispose()
  })
  Maps.forEach(obj => {
    scene.remove(obj)
    obj.kill()
  })
  scene.remove(Amlight)
  Amlight.dispose()
  Texts.forEach(txt => {
    txt.kill()
  })
  Moon.kill()
}


async function EndGameLoop() {
  MoonSpin += speed
  speed += 0.0001
  SetCamMode(false)
  Moon.rotate(MoonSpin, 0 , MoonSpin)
  if (CamX > 0) {
    camera.rotateX(CamX / 200)
    CamX -= 0.05
  }
  else {
    //range = 400
    //safe = 100
    if (camera.position.y > 20)
      camera.position.y--
    for (let index = 1; index < Maps.length; index++) {
      let element = Maps[index];
      element.position.y += speed
      if (element.position.y > range / 4)
        element.position.y = (-range / 1.5)
    }
  }
  if (keys.space.pressed &&  CamX < 1) { Loop = 0 }
  if (Loop) {
    Draw()
    requestAnimationFrame(EndGameLoop)
  }
  else {
    await LeaveEndGame()
    const ft = newGamedata._CallBack
    ft(newGamedata, newTrounemanData)
    return
  }
}