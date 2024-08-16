import * as THREE from 'three'
import { Box } from './box.js'
import { scene, camera, renderer, Draw } from './render.js'
import { keys } from './keybord.js'
import { initGame } from './game.js'



let MenuLight = []
let MenuObj   = []
let TextMenu  = []
let Select    = 0
let Loop      = 1
let on        = false
let a         = 3

function AddButton(p, layer) {
  MenuObj[layer] = new Box({
    width: 0.1,
    height: 2,
    depth: 4,
    velocity: {
      x: 0,
      y: 0,
      z: 0
    },
    position: p
  })
}


//const followText = document.getElementById('follow-text')
//const canvas = document.querySelector('canvas')
//const boxPosition = new THREE.Vector3()

function MoveArrow(x, y, z) {
  //87
  MenuObj[3].position.set(x, y, z)
  MenuObj[4].position.set(x, y, z - 0.87)
}

export function initMenu() {
  on = false
  MenuLight[0] = new THREE.DirectionalLight(0xffffff, 1)
  MenuLight[1] = new THREE.AmbientLight(0xffffff, 0.5)
  MenuLight[0].position.y = 3
  MenuLight[0].position.z = 1
  MenuLight[0].castShadow = true
  Loop = 1
  AddButton({x:0, y:0, z:0}, 0)
  AddButton({x:0, y:3, z:0}, 1)
  AddButton({x:0, y:-3, z:0}, 2)
  MenuObj[3] = new Box({
    width: 0.1,
    height: 0.3,
    depth: 2,
    color: 'yellow',
    velocity: {
      x: 0,
      y: 0,
      z: 0
    },
    position: {
      x:  0,
      y: -3,
      z:  5
    }
  })
  MenuObj[4] = new Box({
    width: 0.1,
    height: 0.5,
    depth: 0.5,
    color: 'yellow',
    velocity: {
      x: 0,
      y: 0,
      z: 0
    },
    position: {
      x:  0,
      y: -3,
      z:  4.13
    }
  })
  MenuObj[4].rotation.x = 7
  MenuObj.forEach(obj => {
    obj.receiveShadow = true
    scene.add(obj)
  })
  MenuLight.forEach(light => {
    scene.add(light)
  })
  camera.position.set(10, 0, 0)
  MoveArrow(0, a, 4)
  MainMenu()
}

function LeaveMenu() {
  MenuLight.forEach(light => {
    scene.remove(light)
  })
  MenuObj.forEach(obj => {
    scene.remove(obj)
  })
}






function MainMenu() {
  // text
  //boxPosition.setFromMatrixPosition(MenuObj[0].matrixWorld)
  //boxPosition.project(camera)
  //var wh = canvas.width / 2
  //var hh = canvas.height / 2
  //boxPosition.x = (boxPosition.x * wh) + wh
  //boxPosition.y = - (boxPosition.y * hh) + hh
  //followText.style.top = `${boxPosition.y}px`
  //followText.style.left = `${boxPosition.x}px`
  //% 
  if (keys.a.pressed && !on) {
    a += 3
    if (a > 3)
      a = -3
    MoveArrow(0, a, 4)
    on = true
  }
  if (keys.d.pressed && !on) {
    a -= 3
    if (a < -3)
      a = 3
    MoveArrow(0, a, 4)
    on = true
  }
  if (!keys.d.pressed && !keys.a.pressed)
    on = false
  if (keys.space.pressed) {
    switch (a) {
      case 3:
        Loop = 0
      LeaveMenu()
      initGame(10)
      break;
      
      default:
        break;
      }
    }
    camera.lookAt(MenuObj[0].position)
    if (Loop) {
      Draw()
      requestAnimationFrame(MainMenu)
    }
}