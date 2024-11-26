import * as THREE from 'three'
import { scene } from './render.js'



export function getLineLen(a , b) { // z and not y 
    return (Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.z - a.z) * (b.z - a.z)))
}


function rand(max) {
    return Math.floor(Math.random() * max)
}

export class line3D {
  constructor (aX, aY, aZ, bX, bY, bZ) { // i hate js so mutch get me out of here, give me c, c++ or c# , jave i don't care just stop that nightmare 
    this.y = 0
    this.a = new THREE.Vector3(aX, aY ,aZ)
    this.b = new THREE.Vector3(bX, bY ,bZ)
    this.Linematerial = null
    this.points = []
    this.Linegeometry = null
    this.line = null
    this.color = null
  }
  setColor(col) {
    this.color = col
  }
  getLen() {
    return (getLineLen(this.a, this.b))
  }
  DrawLine() {
    if (!this.Linematerial) {
      if (!this.color)
        this.Linematerial = new THREE.LineBasicMaterial( { color: rand(0xffffff) } );
      else
        this.Linematerial = new THREE.LineBasicMaterial( { color: this.color } );
    }
    this.points.push( new THREE.Vector3( this.a.x, this.a.y, this.a.z) );
    this.points.push( new THREE.Vector3( this.b.x, this.b.y, this.b.z) );
    this.Linegeometry = new THREE.BufferGeometry().setFromPoints( this.points );
    this.line = new THREE.Line( this.Linegeometry, this.Linematerial );
    scene.add( this.line );
  }
  setRendColor() {
      return (rand(0xffffff))
  }
  rm() {
    if (this.line) {
      scene.remove(this.line)
      this.Linegeometry.dispose()
      this.points = []
      this.Linematerial.dispose()
    }
  }
}


    //  Ball[0].position.x > Players[0].position.x ? Players[0].position.x - (Players[0].width / 2) : Players[0].position.x + (Players[0].width / 2),
    //  Ball[0].position.z < Players[0].position.z ? Players[0].position.z - (Players[0].depth / 2) : Players[0].position.z + (Players[0].depth / 2))
    //  
    //  console.log(Ball[0].position.x > Players[0].position.x ? Players[0].position.x - (Players[0].width / 2) : Players[0].position.x + (Players[0].width / 2),
    //              Ball[0].position.z < Players[0].position.z ? Players[0].position.z - (Players[0].depth / 2) : Players[0].position.z + (Players[0].depth / 2))
    //  scene.add( line );