import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';


// https://stackoverflow.com/questions/50472752/change-extrude-amount-textgeometry-three-js
// https://github.com/ztrottie/ft_transcendence/blob/game_dev/srcs/web/www/Game/components/Text.js


export class Text {
	constructor(scene, position, initialText, color = 'blue', FontName = 'fonts/Ubuntu Light_Bold.json') {
		this.scene = scene;
		this.position = position;
    this.rotation = {x:0, y:0, z:0}
		this._text = initialText;
		this.textMesh = null;
		this.font = null;
    this.color = color
    this.FontName = FontName
		this.loadFont();
	}

	loadFont() {
		const loader = new FontLoader();
		loader.load(this.FontName, (font) => {
			this.font = font;
			this.createTextMesh();
		});
	}

	createTextMesh() {
		if (!this.font) {
			console.error('Font not loaded yet');
			return;
		}

		if (this.textMesh) {
			this.scene.remove(this.textMesh);
			this.textMesh.geometry.dispose();
			this.textMesh.material.dispose();
		}
	
		const textGeometry = new TextGeometry(String(this._text), {
			font: this.font,
			size: 0.5,
			height: 0.1,
			curveSegments: 12,
			bevelEnabled: false,
		});
    
		const textMaterial = new THREE.MeshStandardMaterial({ color: this.color });
		this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
    this.textMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
		textGeometry.computeBoundingBox();
		const bbox = textGeometry.boundingBox;
		const textWidth = bbox.max.x - bbox.min.x;
		const textDepth = bbox.max.z - bbox.min.z;
	
		// Centrer le texte


    this.textMesh.position.set(
			this.position.x - (textWidth / 2) - 0.08,
			this.position.y,
			this.position.z + textDepth * 2
		);
		this.scene.add(this.textMesh);
	}
	
  move(_x, _y, _z) {
    this.position.x = _x
    this.position.y = _y
    this.position.z = _z
    this.createTextMesh();
  }
	update(newText) {
		if (this._text !== newText) {
			this._text = newText;
			this.createTextMesh();
		}
	}
  rotate(_x, _y, _z) {
    this.rotation.x = THREE.MathUtils.degToRad(_x);
    this.rotation.y = THREE.MathUtils.degToRad(_y);
    this.rotation.z = THREE.MathUtils.degToRad(_z);
    this.createTextMesh();
  }
  kill() {
    this.scene.remove(this.textMesh)
  }
}