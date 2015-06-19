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

var ambientLight = new THREE.AmbientLight(0xeeeeee);
scene.add(ambientLight);

//var pointLight = new THREE.PointLight(0xFFFFFF);
//scene.add(pointLight);
//pointLight.position.set(5000, 5000, 1000);

var directionalLight = new THREE.DirectionalLight(0x555555, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);


controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.addEventListener('change', render);
controls.noZoom = true;
controls.noPan = true;

function render () {
    earth.mesh.rotation.y += 0.002;
    earth.clouds.rotation.y += 0.0018;
    renderer.render(scene, camera);
}

function animate () {
    requestAnimationFrame(animate);
    render();
    controls.update();
    stats.update();
}

animate();

render();
