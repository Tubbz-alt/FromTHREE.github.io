const BLINT_SPEED = 0.05

function createEarth () {
  let geometry = new THREE.SphereGeometry(100, 60, 60)
  let material = new THREE.MeshBasicMaterial({
    color: 0x000000
    // opacity: 1
  })
  let mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

function createEarthParticles () {
	let texture = new THREE.TextureLoader().load('./blingbling/img/snowflake5.png')
  let positions = []
  let materials = []
  let sizes = []
  for (var i = 0; i < 2; i++) {
  	positions[i] = {
  		positions: []
  	}
  	sizes[i] = {
  		sizes: []
  	}
  	let mat = new THREE.PointsMaterial()
  	mat.size = 5
		mat.color = new THREE.Color(255 / 255, 105 / 255, 180 / 255)
		mat.map = texture
		mat.depthWrite = false
		mat.transparent = true
		mat.opacity = 0
		mat.side = THREE.FrontSide
		mat.blending = THREE.AdditiveBlending
  	let n = i / 2
  	mat.t_ = n * Math.PI * 2
  	mat.speed_ = BLINT_SPEED
  	mat.min_ = .2 * Math.random() + .5
  	mat.delta_ = .1 * Math.random() + .1
  	mat.opacity_coef_ = 1
  	materials.push(mat)
  }
  var spherical = new THREE.Spherical
  spherical.radius = 100
  const step = 250
  for (let i = 0; i < step; i++) {
  	let vec = new THREE.Vector3
  	let radians = step * (1 - Math.sin(i / step * Math.PI)) / step + .5
    for (let j = 0; j < step; j += radians) {
      let c = j / step,
          f = i / step,
          index = Math.floor(2 * Math.random())
          pos = positions[index]
          size = sizes[index]
      if (isLandByUV(c, f)) {
	     	spherical.theta = c * Math.PI * 2 - Math.PI / 2
	      spherical.phi = f * Math.PI
	      // let lng = (c - 1 / 4) / 90 - 90
	      // let lat = 90 - 180 * f
	      vec.setFromSpherical(spherical)
	      // vec = convertFromLnglatToVec3([lng, lat])
	      pos.positions.push(vec.x)
	      pos.positions.push(vec.y)
	      pos.positions.push(vec.z)
	      if (j % 3 === 0) {
	      	size.sizes.push(8.0)
	      }
      }

    }
  }
  for (let i = 0; i < positions.length; i++) {
  	let pos = positions[i],
  			size = sizes[i],
  			bufferGeom = new THREE.BufferGeometry,
  			typedArr1 = new Float32Array(pos.positions.length)
  			typedArr2 = new Float32Array(size.sizes.length)
      for (let j = 0; j < pos.positions.length; j++) {
      	typedArr1[j] = pos.positions[j]
      }
      for (let j = 0; j < size.sizes.length; j++) {
      	typedArr2[j] = size.sizes[j]
      }
      bufferGeom.addAttribute("position", new THREE.BufferAttribute(typedArr1, 3))
      bufferGeom.addAttribute('size', new THREE.BufferAttribute(typedArr2, 1))
      bufferGeom.computeBoundingSphere()
      // let material = new THREE.PointsMaterial({
      // 	color: 0x03d98e
      // })
      let particle = new THREE.Points(bufferGeom, materials[i])
      earthParticles.add(particle)
  }
  scene.add(earthParticles)
}

function isLandByUV (c, f) {
  if (!earthImgData) {
    console.error('data error!')
  }
  let n = parseInt(earthImg.width * c)
      o = parseInt(earthImg.height * f)
  return 0 === earthImgData.data[4 * (o * earthImgData.width + n)]
}