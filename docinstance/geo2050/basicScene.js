const radius = 200
const BODY_MARGIN = 10
const CITY_RADIUS = 5
const CITY_MARGIN = 2
const SPEED = 0.002
const BLINT_SPEED = 0.05
const BLING_CITY_HEIGHT = 50
const BLING_CITY_WIDTH = 10
const IMGS = ['./geo2050/img/lightray_yellow.jpg', './geo2050/img/lightray.jpg']
const IMGS_COLOR = [0xffff00, 0xffffff]

const SPUTNIK_ROTATIONS = [
	new THREE.Vector3(-.5, 0, 0),
	new THREE.Vector3(.6, 3, -1.2)
]

function createBasicScene () {
	const WIDTH = window.innerWidth
	const HEIGHT = window.innerHeight
	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000)
	camera.position.z = 500

	renderer = new THREE.WebGLRenderer()
	renderer.setSize(WIDTH, HEIGHT)
	renderer.autoClearColor = new THREE.Color(0, 0, 0, 0)
	// renderer.setClearColor(0x000000)
	// renderer.clearColor(true, true, false)
	document.body.appendChild(renderer.domElement)

	trackball = new THREE.TrackballControls(camera)
	trackball.rotateSpeed = 1.0
  trackball.zoomSpeed = 1.0
  trackball.panSpeed = 1.0
  // trackball.noPan = true

  ambiLight = new THREE.AmbientLight(0x141414)
  ambiLight.position.set(0, radius * 2 + 20, radius * 2 + 20)
  scene.add(ambiLight)

  directionalLight = new THREE.DirectionalLight()
  directionalLight.position.set(0, radius, radius * 3)
  scene.add(directionalLight)

 	// axes = new THREE.AxesHelper(50)
  // scene.add(axes)

  fog = new THREE.Fog(0x222222, camera.position.z - 50, camera.position.z + 100)
  scene.fog = fog

  // let fog1 = new THREE.Fog(0x222222, camera.position.z - 1.3 * radius - 100, camera.position.z - 1.3 * radius + 10)
  // scene.fog = fog1

  clock = new THREE.Clock()
  window.addEventListener('mousedown', countryDetail)
  window.addEventListener('resize', resize)
}

function createTextureEarth () {
	let geom = new THREE.SphereGeometry(500, 50, 50)
	let mat = new THREE.MeshBasicMaterial()
	let texture = new THREE.TextureLoader().load('./geo2050/img/earth_lx.jpg', (tex) => {
		mat.map = tex
		let mesh = new THREE.Mesh(geom, mat)
		scene.add(mesh)
	})
}

function createEarthLines (lines) {
	let material = new THREE.MeshBasicMaterial({
		color: 3257463
	})
	lines.forEach((line, i) => {
		let geometry = new THREE.Geometry()
		let vertices = []
		line.forEach((lnglat, i) => {
			const pos = convertFromLnglatToVec3(lnglat)
			vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z))
		})
		let curve = new THREE.CatmullRomCurve3(vertices)
		geometry.vertices = curve.getPoints(2000)
		let mesh = new THREE.Line(geometry, material)
		earthLines.add(mesh)
	})
	scene.add(earthLines)
}

function createEarthParticles () {
	let texture = new THREE.TextureLoader().load('./geo2050/img/dot.png')
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
		mat.color = new THREE.Color(3257463)
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
  spherical.radius = radius
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

function createBlingCities (cities) {
	let positions = []
	let imgs = []
	imgs[0] = []
	imgs[1] = []
	cities.forEach((city, i) => {
		let position = convertFromLnglatToVec3(city.position)
		let index = Math.floor(Math.random() * 2)
		imgs[index].push(i)
		positions.push(position)
		createBlingHexagon(position, IMGS_COLOR[index])
	})
	blingCities.add(blingHexagons)
	createBlingCones(imgs, positions)
	blingCities.add(blingCones)
	scene.add(blingCities)
	cityPositions = positions
}

function createBlingHexagon (position, color, no) {
	let hexagonLine = new THREE.CircleGeometry(CITY_RADIUS, 6)
	let hexagonPlane = new THREE.CircleGeometry(CITY_RADIUS - CITY_MARGIN, 6)
	let vertices = hexagonLine.vertices
	vertices.shift() // 第一个节点是中心点
	let circleLineGeom = new THREE.Geometry()
	circleLineGeom.vertices = vertices
	let materialLine = new THREE.MeshBasicMaterial({
		color: color,
		side: THREE.DoubleSide
	})
	let materialPlane = new THREE.MeshBasicMaterial({
		color: color,
		side: THREE.DoubleSide,
		fog: false
	})
	let circleLine = new THREE.LineLoop(circleLineGeom, materialLine)
	let circlePlane = new THREE.Mesh(hexagonPlane, materialPlane)
	setPosition(circleLine, position)
	setPosition(circlePlane, position)
	circlePlane.lookAt(new THREE.Vector3(0, 0, 0))
	circleLine.lookAt(new THREE.Vector3(0, 0, 0))

	blingHexagons.add(circleLine)
	blingHexagons.add(circlePlane)
}

function createBlingCones (imgs, positions) {
	for (let i = 0; i < IMGS.length; i++) {
		let texture = new THREE.TextureLoader().load(IMGS[i], (texture) => {
			let material = new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.DoubleSide,
				transparent: true,
				depthTest: false,
				blending: THREE.AdditiveBlending,
				fog: false
			})
			material.map.wrapT = THREE.ClampToEdgeWrapping
			for (let j = 0; j < imgs[i].length; j++) {
				let randomHeight = BLING_CITY_HEIGHT * Math.random() + 10,
						geometry = new THREE.PlaneGeometry(BLING_CITY_WIDTH, randomHeight),
						position = positions[imgs[i][j]],
						vecPosition = new THREE.Vector3(position.x, position.y, position.z),
						mesh1 = new THREE.Mesh(geometry, material),
						matrix1 = new THREE.Matrix4

				matrix1.makeRotationX(Math.PI / 2)
				matrix1.setPosition(new THREE.Vector3(0, 0, randomHeight / -2))
				geometry.applyMatrix(matrix1)
				let mesh2 = mesh1.clone()
				mesh1.add(mesh2)
				mesh2.rotation.z = Math.PI / 2
				mesh2.matrixAutoUpdate = false
				mesh2.updateMatrix()
				mesh1.position.copy(vecPosition)
				mesh1.lookAt(new THREE.Vector3(0, 0, 0))
				mesh1.matrixAutoUpdate = false
				mesh1.updateMatrix()

				blingCones.add(mesh1)
			}
		})
	}
}

function drawRing (position, innerRadius, outerRadius, rotation, r) {
	  let geometry = new THREE.RingGeometry(innerRadius, innerRadius + outerRadius, 64, 1),
        matrix = new THREE.Matrix4
    r ? matrix.setPosition(new THREE.Vector3(0, 0, .29 * innerRadius)) : matrix.makeRotationX(Math.PI / 2)
    geometry.applyMatrix(matrix)
    var material = new THREE.MeshBasicMaterial({ 
    	color: 0x03d98e
    })
    material.side = THREE.DoubleSide
    material.transparent = !0
    material.opacity = .2 * Math.random() + .5
    material.blending = THREE.AdditiveBlending
    material.depthWrite = !1
    let mesh = new THREE.Mesh(geometry, material)
   	mesh.rotation.set(rotation.x, rotation.y, rotation.z)
    mesh.position.set(position.x, position.y, position.z)
    return mesh
}

function createOrbitas () {
  for (let i = 0; i < 10; i += 3) {
    let position = new THREE.Vector3(0, i, 0)
    let rotation = new THREE.Vector3(Math.random() * Math.PI, 0, Math.random() * Math.PI)
    let innerRadius = 1.2 * radius
    let outerRadius = .05 * Math.random() + 1
    position.y = 0
    let mesh = drawRing(position, innerRadius, outerRadius, rotation)
    orbitas.add(mesh)
  }
  scene.add(orbitas)
}

function createSputniks (jsons) {
	for (let i = 0, length = jsons.length; i < length; i++) {
		let loader = new THREE.JSONLoader(),
			innerRadius = 1.2 * radius
			outerRadius = .05 * Math.random() + 1,
			position = new THREE.Vector3(0, i, 0),
			rotation = new THREE.Vector3(Math.random() * Math.PI, 0, Math.random() * Math.PI)
		let orbita = drawRing(new THREE.Vector3, innerRadius, outerRadius, new THREE.Vector3)
		loader.load(jsons[i], (geometry, materials) => {
			let material
			if (materials !== undefined && materials.length > 0) {
				material = materials[0]
			} else {
				material = new THREE.MeshBasicMaterial()
			}
			material.color = new THREE.Color(0x03d98e)
			material.wireframe = true
			let mesh = new THREE.Mesh(geometry, material)
			mesh.position.x = -1 * innerRadius
			mesh.rotation.x = .5
			mesh.scale.set(.7, .7, .7)
			mesh.matrixAutoUpdate = false
			mesh.updateMatrix()
			orbita.add(mesh)
		})
		let sputnik = new THREE.Object3D()
		sputnik.add(orbita)
		sputnik.rotation.x = SPUTNIK_ROTATIONS[i].x
		sputnik.rotation.y = SPUTNIK_ROTATIONS[i].y
		sputnik.rotation.z = SPUTNIK_ROTATIONS[i].z
		sputnik.matrixAutoUpdate = false
		sputnik.updateMatrix()
		sputnik.name = 'sputnik' + i
		scene.add(sputnik)
	}
}

function createEarthRandomHexagons () {
  for (let i = 0; i < 100; i++) {
  	let lng = Math.random() * 360 - 180,
  		lat = Math.random() * 180 - 90
		if (isSeaByDegreeToUV([lng, lat])) {
			let pos = convertFromLnglatToVec3([lng, lat]),
				geometry = new THREE.CircleGeometry(CITY_RADIUS, 6),
				vertices = geometry.vertices,
				circleLineGeom = new THREE.Geometry(),
				color = IMGS_COLOR[Math.floor(Math.random() * 2)],
				material = new THREE.MeshBasicMaterial({
					color: 0x03d98e,
					// side: THREE.Backside,
					opacity: .2
				})
			vertices.shift()
			circleLineGeom.vertices = vertices
			let circleLine = new THREE.LineLoop(circleLineGeom, material)
			setPosition(circleLine, pos)
			circleLine.lookAt(new THREE.Vector3(0, 0, 0))
			blingHexagons.add(circleLine)
		}
  }
}

function createRandomStars (length) {
	let positions = new Float32Array(length * 3)
	const color = new THREE.Color(263385797)
	let spherical = new THREE.Spherical
	let vector = new THREE.Vector3()
	for (let i = 0; i < length; i++) {
		spherical.radius = radius * (1 + 0.6 * Math.random())
		spherical.theta = 8 * Math.random()
		spherical.phi = 0.3 + 2.2 * Math.random()
		vector.setFromSpherical(spherical)
		positions[i * 3] = vector.x
		positions[i * 3 + 1] = vector.y
		positions[i * 3 + 2] = vector.z
	}
	let geometry = new THREE.BufferGeometry()
	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
	let material = new THREE.PointsMaterial()
	material.size = window.devicePixelRatio * 3
	material.side = THREE.FrontSide
	material.color = color
	material.opacity = 0.6
	material.blending = THREE.AdditiveBlending
	material.depthWrite = false
	let points = new THREE.Points(geometry, material)
	randomStars.add(points)
	scene.add(randomStars)
}

function createCloudGrid () {
	THREE.XRayMaterial = function(options) {
	  let uniforms = {
      uTex: {
        type: "t",
        value: options.map || new THREE.Texture
      },
      offsetRepeat: {
        value: new THREE.Vector4(0, 0, 1, 1)
      },
      alphaProportion: {
        type: "1f",
        value: options.alphaProportion || .5
      },
      diffuse: {
        value: options.color || new THREE.Color(16777215)
      },
      opacity: {
        value: options.opacity || 1
      },
      gridOffset: {
        value: 0
      }
	  }
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader:
        ` 
        varying float _alpha;
        varying vec2 vUv;
        uniform vec4 offsetRepeat;
        uniform float alphaProportion;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
            vec4 worldPosition = modelMatrix * vec4( vec3( position ), 1.0 );
            vec3 cameraToVertex = normalize( cameraPosition - worldPosition.xyz);
            _alpha = 1.0 - max( 0.0, dot( normal, cameraToVertex ) );
            _alpha = max( 0.0, (_alpha - alphaProportion) / (1.0 - alphaProportion) );
        }`,
      fragmentShader:
        `
        uniform sampler2D uTex;
        uniform vec3 diffuse;
        uniform float opacity;
        uniform float gridOffset;
        varying float _alpha;
        varying vec2 vUv;
        void main() {
            vec4 texColor = texture2D( uTex, vUv );
            float _a = _alpha * opacity;
            if( _a <= 0.0 ) discard;
            _a = _a * ( sin( vUv.y * 4000.0 + gridOffset ) * .5 + .5 );
            gl_FragColor = vec4( texColor.rgb * diffuse, _a );
        }`,
      transparent: !0,
      blending: THREE.AdditiveBlending,
      depthTest: !1
    })
  }
  let geometry = new THREE.SphereGeometry(1.3 * radius, 66, 44),
  		map = new THREE.TextureLoader().load('./geo2050/img/clouds.jpg')
  map.wrapT = THREE.ClampToEdgeWrapping
  map.wrapS = THREE.ClampToEdgeWrapping
  let material = new THREE.XRayMaterial({
        map: map,
        alphaProportion: .25,
        color: new THREE.Color(263385797),
        opacity: 0,
        gridOffsetSpeed: .6
      }),
      mesh = new THREE.Mesh(geometry, material)
  mesh.matrixAutoUpdate = !1
  cloud.add(mesh)
  scene.add(cloud)
}

function countryDetail (event) {
	let x = event.clientX - window.innerWidth / 2,
		y = window.innerHeight / 2 - event.clientY,
		z = Math.sqrt(radius * radius - x * x - y * y, 0.5),
		index1,
		index2
	if (!isNaN(z)) {
		index1 = getExactCountry(new THREE.Vector3(x, y, z))
		index2 = getExactCountry(new THREE.Vector3(x, y, -1 * z))
	}
	if (index1 !== -1 || index2 !== -1) {
		let distance1 = index1 == -1 ? camera.position.distanceTo(new THREE.Vector3(0, 0, 1000000)) : camera.position.distanceTo(new THREE.Vector3(x, y, z))
		let distance2 = index2 == -1 ? camera.position.distanceTo(new THREE.Vector3(0, 0, 1000000)) : camera.position.distanceTo(new THREE.Vector3(x, y, -1 * z))
		let index = distance1 > distance2 ? index2 : index1
		console.log(index, countries[index])
	}
}

function createCountryDetail () {
	let city = countries[currentClosetIndex],
		position = cityPositions[currentClosetIndex]
	let detail = new THREE.Object3D()
	detail.name = 'float_detail'
	let biggerTexture = new THREE.TextureLoader().load('./geo2050/img/bigger.jpg')
	let smallerTexture = new THREE.TextureLoader().load('./geo2050/img/smaller.jpg')
	let biggerMaterial = new THREE.MeshBasicMaterial({
		map: biggerTexture,
		side: THREE.DoubleSide
	})
	let smallerMaterial = new THREE.MeshBasicMaterial({
		map: smallerTexture,
		side: THREE.DoubleSide
	})
	let smallerCircleMat = new THREE.MeshBasicMaterial({
		color: 263385797,
		side: THREE.DoubleSide
	})
	let biggerGeometry = new THREE.CircleGeometry(20, 6)
	let smallerGeometry = new THREE.CircleGeometry(8, 6)
	let smallerCircle = new THREE.CircleGeometry(10, 6)
	let bigger = new THREE.Mesh(biggerGeometry, biggerMaterial)
	let smaller = new THREE.Mesh(smallerGeometry, smallerMaterial)
	let circle = new THREE.Mesh(smallerCircle, smallerCircleMat)
	setPosition(smaller, {x: 10, y: Math.cos(Math.PI / 6) * 20, z: 0.2})
	setPosition(circle, {x: 10, y: Math.cos(Math.PI / 6) * 20, z: 0.1})
	detail.add(bigger)
	detail.add(smaller)
	detail.add(circle)
	setPosition(detail, position)
	// detail.lookAt(new THREE.Vector3(position.x * 3, position.y * 3, position.z * 3))
	scene.add(detail)
}

function updateClosetCountry () {
	currentClosetIndex = getClosetCountry(camera.position)
	if (currentClosetIndex !== preClosetIndex) {
		preClosetIndex = currentClosetIndex
	}
	let position = cityPositions[currentClosetIndex]
	let city = countries[currentClosetIndex]
	let secondPos = {
		x: position.x * 6 / 5,
		y: position.y * 6 / 5,
		z: position.z * 6 / 5
	}
	// 更新离相机最近的国家的球面法线
	let line = scene.getObjectByName('float_line')
	if (!line) { // 
		let geometry = new THREE.Geometry()
		geometry.vertices.push(
			new THREE.Vector3(position.x, position.y, position.z),
			new THREE.Vector3(secondPos.x, secondPos.y, secondPos.z)
		)
		let material = new THREE.LineBasicMaterial({
			color: 0x48eab6
		})
		line = new THREE.Line(geometry, material)
		line.name = 'float_line'
		scene.add(line)
	} else {
		line.geometry.vertices = [
			new THREE.Vector3(position.x, position.y, position.z),
			new THREE.Vector3(secondPos.x, secondPos.y, secondPos.z)
		]
		line.geometry.verticesNeedUpdate = true
	}
	let div = document.querySelector('#float_info')
	div.innerHTML = city.name
	let screenPos = worldToScreenPosition(new THREE.Vector3(secondPos.x, secondPos.y, secondPos.z), camera)
	div.style.left = screenPos.x + 'px'
	div.style.top = screenPos.y + 'px'
	// 更新detail
	let detail = scene.getObjectByName('float_detail')
	if (!detail) {
		createCountryDetail()
	} else {
		setPosition(detail, new THREE.Vector3(secondPos.x, secondPos.y, secondPos.z))
	}
}

function animate () {
	requestAnimationFrame(animate)
  var delta = clock.getDelta()
  if (camera.position.z < 500 && fadeIn) {
  	camera.position.z += 2.5
  } else if (fadeIn) {
  	fadeIn = false
  	trackball.minDistance = 500 - 50
  	trackball.maxDistance = 500 + radius - 100
  } else if (!fadeIn) {
	  for (let i = 0; i < 2; i++) {
			let sputnik = scene.getObjectByName('sputnik' + i)
			if (sputnik) {
				sputnik.rotation.y += SPEED * 2
				sputnik.updateMatrix()
			} else {
				console.log('cannot find sputnik!')
			}
		}
	  trackball.update(delta)
	  // 更新camera位置以使场景转动
		let spherical = new THREE.Spherical
		spherical.setFromVector3(camera.position)
		spherical.theta += SPEED
		let position = new THREE.Vector3()
		position.setFromSpherical(spherical)
		camera.position.x = position.x
		camera.position.y = position.y
		camera.position.z = position.z
		// 更新离相机最近的国家/城市
		updateClosetCountry()
		// 球面粒子闪烁
		let objects = earthParticles.children
		objects.forEach(obj => {
			let material = obj.material
			material.t_ += material.speed_
			material.opacity = (Math.sin(material.t_) * material.delta_ + material.min_) * material.opacity_coef_
			material.needsUpdate = true
		})
  }
	renderer.render(scene, camera)
}

function resize () {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
}
// 功能函数
function convertFromLnglatToVec3 (lnglat) {
	let spherical = new THREE.Spherical
	spherical.radius = radius
	const lng = lnglat[0]
	const lat = lnglat[1]
	// const phi = (180 - lng) * (Math.PI / 180)
	// const theta = (90 + lat) * (Math.PI / 180)
	const theta = (lng + 90) * (Math.PI / 180)
	const phi = (90 - lat) * (Math.PI / 180)
	spherical.phi = phi
	spherical.theta = theta
	let position = new THREE.Vector3()
	position.setFromSpherical(spherical)
	return {x: position.x, y: position.y, z: position.z}
	// const x = radius * Math.sin(theta) * Math.cos(phi)
	// const y = radius * Math.sin(theta) * Math.sin(phi)
	// const z = radius * Math.cos(theta)

	// return {x, y, z}
}

function setPosition (mesh, position) {
	if (position.x === undefined || position.y === undefined || position.z === undefined) {
		console.error('position is unvalid!')
		return
	}
	mesh.position.x = position.x
	mesh.position.y = position.y
	mesh.position.z = position.z
}

function computeRotation (source, target) {
	let x = source.angleTo(new THREE.Vector3(0, target.y, target.z))      
	let y = source.angleTo(new THREE.Vector3(target.x, 0, target.z))
	let z = source.angleTo(new THREE.Vector3(target.x, target.y, 0))
	return {x, y, z}
}

function isSeaByDegreeToUV (lnglat) {
	let lng = lnglat[0] + 180
	let lat = lnglat[1] + 90
	let width = parseInt(lng / 360 * earthImgData.width)
	let height = parseInt((1 - lat / 180) * earthImgData.height)
	return 255 === earthImgData.data[4 * (height * earthImgData.width + width)]
}

function isLandByUV (c, f) {
	if (!earthImgData) {
		console.error('data error!')
	}
	let n = parseInt(earthImg.width * c)
			o = parseInt(earthImg.height * f)
	return 0 === earthImgData.data[4 * (o * earthImgData.width + n)]
}

function getExactCountry (position) {
	let index = -1
	for (let i = 0, length = cityPositions.length; i < length; i++) {
		let cityPos = new THREE.Vector3(cityPositions[i].x, cityPositions[i].y, cityPositions[i].z)
		let distance = position.distanceTo(cityPos)
		if (distance <= CITY_RADIUS) {
			index = -1
			break
		}
	}
	return index
}

function getClosetCountry (position) {
	let closetIndex = 0
	let closetDistance = Infinity
	cityPositions.forEach((city, i) => {
		let distance = position.distanceTo(new THREE.Vector3(city.x, city.y, city.z))
		if (distance < closetDistance) {
			closetDistance = distance
			closetIndex = i
		}		
	})
	return closetIndex
}

function worldToScreenPosition (obj, camera) {
	let vector = obj.clone()
  let widthHalf = 0.5 * window.innerWidth
  let heightHalf = 0.5 * window.innerHeight

  // camera.updateMatrixWorld() // 函数updateMatrix()和updateMatrixWorld(force)将根据position，rotation或quaternion,scale参数更新matrix和matrixWorld。updateMatrixWorld还会更新所有后代元素的matrixWorld，如果force值为真则调用者本身的matrixWorldNeedsUpdate值为真。

  // getPositionFromMatrix()方法已经删除,使用setFromMatrixPosition()替换, setFromMatrixPosition方法将返回从矩阵中的元素得到的新的向量值的向量
  // vector.setFromMatrixPosition(obj.matrixWorld)

  //projectOnVector方法在将当前三维向量(x,y,z)投影一个向量到另一个向量,参数vector(x,y,z). 
  vector.project(camera)

  vector.x = (vector.x * widthHalf) + widthHalf
  vector.y = -(vector.y * heightHalf) + heightHalf

  return {
    x: vector.x,
    y: vector.y
  }
}

function pointToScreenPosition (worldPoint, camera) {
    let p = new THREE.Vector4()

    p.x = worldPoint.x
    p.y = worldPoint.y
    p.z = worldPoint.z

    p.applyMatrix4(camera.matrixWorldInverse)
    p.applyMatrix4(camera.projectionMatrix)

    let width = window.innerWidth
    let height = window.innerHeight
    point = new THREE.Vector3(
                ((p.x + 0.5) / width) * 2 - 1,
               -((p.y + 0.5) / height) * 2 + 1, 
               1)

    return {
        x: Math.floor(point.x) + 0.5,
        y: Math.floor(point.y) + 0.5
    }
}
