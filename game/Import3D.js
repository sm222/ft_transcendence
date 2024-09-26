import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';


//> 
//> const loader = new GLTFLoader();
//> 
//> loader.load( 'model/three.glb', function ( gltf ) {
//> 
//> 	scene.add( gltf.scene );
//> 
//> }, undefined, function ( error ) {
//> 
//> 	console.error( error );
//> 
//> });

export class MODEL3D {
    constructor(scene, position, size = [1,1,1], 
      ModelName = 'model/three.glb') {
      this.scene = scene;
      this.position = position;
      this.rotation = {x:0, y:0, z:0}
      this.ModelName = ModelName
      this.size = size
      //
      this.loadModel();
    }
  
    loadModel() {
      if (!this.model)
        this.kill()
      const loader = new GLTFLoader();
      loader.load(this.ModelName, (model) => {
        this.model = model.scene;
        model.scene.scale.set(this.size[0], this.size[1], this.size[2])
        this.scene.add( model.scene );
        this.createTextMesh();
      });
    }
  
    createTextMesh() {
      if (!this.model) {
        console.error('Font not loaded yet');
        return;
      }  
      this.Update()
    }
//
    Update() {
      if (this.model) {
          this.model.position.set(
          this.position.x,
          this.position.y,
          this.position.z
        );
        this.model.rotation.x = this.rotation.x
        this.model.rotation.y = this.rotation.y
        this.model.rotation.z = this.rotation.z
      }
    }
    resize(size = []) {
      this.size = size
    }
    move(_x, _y, _z) {
      this.position.x = _x
      this.position.y = _y
      this.position.z = _z
      this.Update()
    }
    rotate(_x, _y, _z) {
      this.rotation.x = THREE.MathUtils.degToRad(_x);
      this.rotation.y = THREE.MathUtils.degToRad(_y);
      this.rotation.z = THREE.MathUtils.degToRad(_z);
      this.Update()
    }
    kill() {
      this.scene.remove(this.model)
      this.model = null
    }
    getPosition() {
      return this.position
    }
  }