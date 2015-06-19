'use strict';

var Earth = Klass.extend({

    initialize: function (options, scene) {
        if (!scene) console.error('You must pass scene to a planet');

        var geometry = new THREE.SphereGeometry(0.5, 32, 32);
        var material = new THREE.MeshPhongMaterial();

        var map = THREE.ImageUtils.loadTexture('images/earth_contour_map.jpg');
        map.anisotropy = 16;

        material.map = map;
        // material.bumpMap = THREE.ImageUtils.loadTexture('images/earth_bump_4k.jpg');
        // material.bumpScale = 0.005;
        // material.specularMap = THREE.ImageUtils.loadTexture('images/earth_spec_4k.png');
        // material.specular = new THREE.Color('grey');

        this.mesh = new THREE.Mesh(geometry, material);

        this.setUpClouds();

        this.addToScene(scene);
    },

    setUpClouds: function () {
        var geometry = new THREE.SphereGeometry(0.503, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/earth_clouds_4k.png'),
            transparent: true,
            side: THREE.DoubleSide
        });

        this.clouds = new THREE.Mesh(geometry, material);
    },

    addToScene: function (scene) {
        scene.add(this.mesh);
        scene.add(this.clouds);
    }
});