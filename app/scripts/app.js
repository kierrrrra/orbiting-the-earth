var _ = require('lodash');
var $ = require('jquery');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var Stats = require('./vendor/stats.min.js');
var story = require('./story.js');

var Earth = require('./earth.js');

var scene = new THREE.Scene();

var $earth = $('.earth');

var camera = new THREE.PerspectiveCamera(45, $earth.width()/$earth.height(), 0.1, 1000);
camera.position.z = 1.5;
camera.lookAt(new THREE.Vector3(0,0,0));

var renderer = new THREE.WebGLRenderer({alpha: true});

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.left = '0px';
document.body.appendChild(stats.domElement);


renderer.setClearColor(0x000000, 0);
renderer.setSize($earth.width(), $earth.height());

$earth.append(renderer.domElement);


var earth = new Earth({}, scene);

earth.mesh.rotation.y = 1;

var ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

//var pointLight = new THREE.PointLight(0xFFFFFF);
//scene.add(pointLight);
//pointLight.position.set(5000, 5000, 1000);

var directionalLight = new THREE.DirectionalLight(0x666666, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);


//var controls = new OrbitControls(camera);

function render () {
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
}
render();
