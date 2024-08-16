import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';
import { scene } from './render.js';

// https://stackoverflow.com/questions/50472752/change-extrude-amount-textgeometry-three-js

const loader = new FontLoader();
var   font

loader.load(
  // resource URL
  'fonts/Open Sans_Regular.json',

  // onLoad callback
  function ( font ) {
    // do something with the font
    console.log( font );
    const tt = new TextGeometry( 'play', {
      font: font,
      size: 1,
      height: 0.1,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0.01,
      bevelOffset: 0.05,
      bevelSegments: 1
    } );
    const mm = new THREE.MeshNormalMaterial();
    const out = new THREE.Mesh(tt, mm);
    out.rotation.y = 1.56
    out.position.z = 1.3
    out.position.y = 2.6 
    scene.add(out);
  },
  // onProgress callback
  function ( xhr ) {
  	console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },

// onError callback
function ( err ) {
    console.log( 'An error happened' );
  }
);

export function makeText() {
  
}



class text3D extends TextGeometry {
  constructor({
    text,
    font: font,
  }) {
    super (
      text, {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0.01,
        bevelOffset: 0.05,
        bevelSegments: 1
      }
    )
    const MeshnormMat = new THREE.MeshNormalMaterial()
    const meshfinal = new THREE.Mesh(tg, MeshnormMat)

  }
  GiveMesh() {
    return meshfinal
  }
}

export function importText (fontName, text) {
  font = loader.load(fontName)
  tg = new TextGeometry( 'lol', {
    font: font,
    size: 1,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0.01,
    bevelOffset: 0.05,
    bevelSegments: 1
  } );
}