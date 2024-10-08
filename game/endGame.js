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

let    Moon              =  null
let    MoonSpin          =  0
let    speed             = 0.01

//"moon" (https://skfb.ly/oFR LK) by RenderX is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament

export async function initEndGame(gamedata, tournamentdata)
{
  newGamedata.copy(gamedata)
  newTrounemanData.copy(tournamentdata)
  //
  CamX = 5
  MoonSpin = 0
  speed = 0
  camera.position.set(0, 109 ,0)
  Light[0] = new THREE.DirectionalLight(0xffffff, 1)
  Light[0].position.y = 5
  Light[0].position.z = 5
  Amlight = new THREE.AmbientLight(0xffffff, 5)
  Light.forEach(light => {
    light.castShadow = true
    scene.add(light)
  })
  const moonSize = 20
  Moon = new MODEL3D(scene, {x:0 , y:-15, z:0}, [moonSize, moonSize ,moonSize], 'model/moon.glb')
  Maps[0] = new ball({
    width: 1,
    height: 0.5,
    depth: 1,
    color: 'darkgray',
    position: {
      x: 0,
      y: -10,
      z: 0
    },
    zAcceleration:true,
    opacity:1,
    transparent: true
    })
    Maps.forEach(obj => {
      obj.receiveShadow = true
      scene.add(obj)
    })
  camera.lookAt(Maps[0].position)
  Loop = true
  camera.rotateX(CamX)
  const PlayersName = gamedata.getNames()
  const playersScore = gamedata.getEndScore()
  const playersColors = gamedata.getPlayersNameColor()
  endBoard = [] //! reset endboard
  for (let index = 0; index < PlayersName.length; index++) {
    endBoard.push([playersScore[index], PlayersName[index], playersColors[index]])
  }
  endBoard.sort()
  let ofSet = 0
  if (1)
    ofSet += 0
  for (let index = endBoard.length - 1; index > -1; index--) {
    Texts[index + 1] = new Text(scene, {x:ofSet ,y:8,z:-(index * 1.2)}, String(endBoard[index][1] + ' : ' + endBoard[index][0]), endBoard[index][2])
    Texts[index + 1].rotate(-90,0,0)
  }
  const gameTime = gamedata.getTime()
  Texts.push(new Text(scene, {x:-6, y:8, z:4}, String("Time play: m" + gameTime[0] + ":s" + gameTime[1])))
  Texts[Texts.length - 1].rotate(-90,0,0)
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
  Moon.rotate(MoonSpin, 0 , MoonSpin)
  if (CamX > 0) {
    camera.rotateX(CamX / 200)
    CamX -= 0.05
  }
  else {
    if (camera.position.y > 20)
      camera.position.y--
    SetCamMode(true)
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