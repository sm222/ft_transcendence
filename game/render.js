import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

const ratio = 1.5

export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

export const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})

window.addEventListener('resize', function( ) {
  const newW = window.innerWidth  / ratio
  const newH = window.innerHeight / ratio
  renderer.setSize(newW, newH)
  camera.aspect = newW / newH
  camera.updateProjectionMatrix()
} )

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth / ratio, window.innerHeight / ratio)
document.body.appendChild(renderer.domElement)
export const controls = new OrbitControls(camera, renderer.domElement)


export function SetCamMode(mode) {
  controls.enableRotate = mode
  controls.enablePan    = mode
  controls.enableZoom   = mode
  //if (mode)
  //  controls.reset()
}

export function Draw() {
  renderer.render(scene, camera)
}