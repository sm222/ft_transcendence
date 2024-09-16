import * as THREE from 'three'
import { Box } from './box.js'
import { ball } from './ball.js'
import { scene, camera, Draw, SetCamMode } from './render.js'
import { gamedata } from './main.js'
import { keys } from './keybord.js'
import { Text } from './text.js'
import { MODEL3D } from './Import3D.js'

const  Second    =  60
const  TimerDef        =  (Second * 5)
let    Wait            =  0

export let   endScore  =  [] // js is such a shit show i hate it

let   Texts            =  []

let   Light            =  []
let   Amlight

let   Maps             =  []

let   Loop             =  true

let   CamX             =  5


export function initEndGame()
  {
    //
    camera.position.set(0, 109 ,0)
    Light[0] = new THREE.DirectionalLight(0xffffff, 2)
    Light[0].position.y = 3
    Light[0].position.z = 1
    Amlight = new THREE.AmbientLight(0xffffff, 10)
    Light.forEach(light => {
      light.castShadow = true
      scene.add(light)
    })
    Maps[0] = new ball({
      width: 30,
      height: 0.5,
      depth: 30,
      color: 'white',
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
    //
    Texts[0] = new Text(scene, {x:0,y:8,z:0}, String(gamedata.getTime()), 'blue')
    Texts[0].rotate(-90,0,0)
    camera.rotateX(CamX)
    EndGameLoop()
}



function EndGameLoop() {

  if (CamX > 0) {
    camera.rotateX(CamX / 200)
    CamX -= 0.05
  }
  else {
    if (camera.position.y > 24)
      camera.position.y--
    SetCamMode(true)
  }
  if (Loop) {
    console.log(camera.position)
    Draw()
    requestAnimationFrame(EndGameLoop)
  }
  else {
    console.log("")
  }
}