import * as THREE from 'three'
import { scene, camera, Draw, SetCamMode } from './render.js'
import { Box } from         './box.js'
import { keys } from        './keybord.js'
import { Text } from        './text.js'
import { MODEL3D } from     './Import3D.js'
import { initEndGame } from './endGame.js'

import { GameData   } from './gameSetting.js'
import { Tournament } from './tournament.js'

const Second        =  60
const FirstPause    =  (Second * 5)

let   Pause         =  true
let   PauseTime     =  FirstPause

let   Map           =  []

let   Light         =  []
let   Amlight       =  []
let   GameText      =  []

let   end           =  0
let   GameLoop      =  1

// --> copy before the game start
const  newGamedata       =   new GameData
const  newTrounemanData  =   new Tournament
// <--

//function rand(max) {
//  return Math.floor(Math.random() * max)
//}

let    addY          =  0

export async function initDevRoom(gamedata, tournamentdata) 
{
  // alway start with that
  newGamedata.copy(gamedata)
  newTrounemanData.copy(tournamentdata)
  //
  newGamedata.resetTime()
  newGamedata.setEndGame(initEndGame)
  //
  GameLoop = 1
  //
  Light[0] = new THREE.DirectionalLight(0xffffff, 1)
  Light[0].position.y = 10
  Light[0].position.z = 0
  Amlight = new THREE.AmbientLight(0xffffff, 0.8)
  //
  Map[0] = new Box({
    width: 1, height: 1, depth: 1,
    color: 'darkorange',
    velocity: { x:0, y:  0, z:0},
    position: { x:0, y: -2, z:0}
  })
  GameText[0] = new Text(scene, {x:0,y:0,z:0},String("the dev room"))
  const PlayersNames = newTrounemanData._PlayersNames
  for (let index = 0; index < PlayersNames.length; index++) {
    GameText[GameText.length] = (new Text(scene, {x:-3,y:-4 + -index ,z:0},String(PlayersNames[index]), newTrounemanData._PlayerColorsName[index]))
    GameText[GameText.length] = (new Text(scene, {x: 0,y:-4 + -index ,z:0},String("|")                , newTrounemanData._PlayersColors[index]))
    addY = (-5 + -index)
  }
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("totalRound " + newTrounemanData._totalRound))
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("roundIndex " + newTrounemanData._roundIndex))
  addY -= 1
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("game made by"), String('yellow'))
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("Antoine"), String('blue'))
  addY -= 1
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("front made by"), String('yellow'))
  GameText[GameText.length] = new Text(scene, {x:0, y:addY -= 1, z:0}, String("Élodie"), String('green'))
  Map.forEach( obj => {
    obj.receiveShadow = true
    scene.add(obj)
  })
  scene.add(Amlight)
  Light.forEach( l => {
    l.castShadow = true
    scene.add(l)
  })
  GameText.forEach( t => {
    t.rotate(0,0,0)
  })
  //don't forget to move the camera out of the geometry
  camera.position.set(0,10,0)
  //* start the game do that last
  devRoom()
}

async function LeaveDevRoom() {
  scene.remove(Amlight)
  Amlight.dispose()
  //remove the light an
  Light.forEach( l => {
    scene.remove(l)
    l.dispose()
  })
  // call kill for text to remove from scene and clean mesh
  GameText.forEach( t => {
    t.kill()
  })
  // use remove and kill after the clean the mesh
  Map.forEach( obj => {
    scene.remove(obj)
    obj.kill()
  })
}


function keybordGame(noGame) {
  // look if the keybord need to be ignore
  if (noGame > 1) {
    return
  }
}

const min     =  6
const max     =  20
let   speed   =  0.015

let   camPosx =  0
let   camPosy =  min
let   camPosz =  0

async function devRoom() {
  keybordGame(GameLoop)
  SetCamMode(false)
  camera.position.set(camPosx , camPosy, camPosz + 5)
  Light[0].position.set(Light[0].position.x, Light[0].position.y, camPosz + 5)
  camPosy -= speed
  if (camPosy <= -max) {
    camPosy = 4
  }
  console.log(camPosy)
  if (keys.k.pressed || end == 1 ) { GameLoop = 0 }
  if (GameLoop > 1) { }
  else if (GameLoop) {
    Draw()
    requestAnimationFrame(devRoom)
  }
  else {
    // end of the game here
    await LeaveDevRoom()
    const ft = newGamedata.getEndGame()
    ft(newGamedata, newTrounemanData)
    return // add a return to stop the loop
  }
}
