const radius = 50
const CITY_RADIUS = 1
const BLING_CITY_HEIGHT = 20
const BLING_CITY_WIDTH = 1
function createBasicScene () {
	const WIDTH = window.innerWidth
	const HEIGHT = window.innerHeight
	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000)
	camera.position.z = 120

	renderer = new THREE.WebGLRenderer()
	renderer.setSize(WIDTH, HEIGHT)
	renderer.setClearColor(0x000000)
	renderer.clearColor(true, true, false)
	document.body.appendChild(renderer.domElement)

	trackball = new THREE.TrackballControls(camera)
	trackball.rotateSpeed = 1.0
  trackball.zoomSpeed = 1.0
  trackball.panSpeed = 1.0

  ambiLight = new THREE.AmbientLight(0x141414)
  ambiLight.position.set(0, 120, 120)
  scene.add(ambiLight)

  directionalLight = new THREE.DirectionalLight()
  directionalLight.position.set(0, 200, 200)
  scene.add(directionalLight)

  var axes = new THREE.AxesHelper(50)
  scene.add(axes)

  clock = new THREE.Clock()
}

function createSphereGeometry ({widthSeg, heightSeg}) {
	return new THREE.SphereGeometry(radius, widthSeg, heightSeg)
}

function createBasicMesh (type, options, pos) {
	let geometry
	switch (type) {
		case 'sphere':
		 geometry = createSphereGeometry(options)
		 break
	}
	let material = new THREE.LineBasicMaterial({
		color: 0xcd664e
	})
	let mesh = new THREE.Mesh(geometry, material)
	setPosition(mesh, pos)
	return mesh
}

function createLinesMesh (lines) {
	let material = new THREE.MeshBasicMaterial({
		color: 0x03d98e
	})
	lines.forEach((line, i) => {
		let geometry = new THREE.Geometry()
		let vertices = []
		line.forEach((lnglat, i) => {
			const pos = convertFromLnglatToVec3(lnglat)
			vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z))
		})
		let curve = new THREE.CatmullRomCurve3(vertices)
		geometry.vertices = curve.getPoints(1000)
		let mesh = new THREE.Line(geometry, material)
		scene.add(mesh)
	})
}

function createBlingCity (lnglat) {
	const position = convertFromLnglatToVec3(lnglat)
	let hexagonLine = new THREE.CircleGeometry(CITY_RADIUS, 6)
	let hexagonPlane = new THREE.CircleGeometry(CITY_RADIUS - 0.3, 6)
	let vertices = hexagonLine.vertices
	vertices.shift() // 第一个节点是中心点
	let circleLineGeom = new THREE.Geometry()
	circleLineGeom.vertices = vertices
	let material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide
	})
	let circleLine = new THREE.LineLoop(circleLineGeom, material)
	let circlePlane = new THREE.Mesh(hexagonPlane, material)
	setPosition(circleLine, position)
	setPosition(circlePlane, position)
	circlePlane.lookAt(new THREE.Vector3(0, 0, 0))
	circleLine.lookAt(new THREE.Vector3(0, 0, 0))
	scene.add(circleLine)
	scene.add(circlePlane)
}

function createTextureCity (lnglat, url) {
	let geometry = new THREE.PlaneGeometry(BLING_CITY_WIDTH, BLING_CITY_HEIGHT)
	// geometry.faceVertexUvs[0][0] = [
	// 	new THREE.Vector2(1, 0),
	// 	new THREE.Vector2(1, 1),
	// 	new THREE.Vector2(0, 0)
	// ]
	// geometry.faceVertexUvs[0][1] = [
	// 	new THREE.Vector2(1, 1),
	// 	new THREE.Vector2(0, 1),
	// 	new THREE.Vector2(0, 0)
	// ]

	let material
	let position = convertFromLnglatToVec3(lnglat)
	const vecPosition = new THREE.Vector3(position.x, position.y, position.z)

	let geom = new THREE.Geometry()
	geom.vertices = [
		new THREE.Vector3(0, 0, 0),
		vecPosition
	]
	let mat = new THREE.MeshBasicMaterial({
		color: 0x00ffff
	})
	let m = new THREE.Line(geom, mat)
	scene.add(m)

	let texture = new THREE.TextureLoader().load(url, (texture) => {
		material = new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.DoubleSide
		})
		let mesh1 = new THREE.Mesh(geometry, material)
		setPosition(mesh1, position)

		mesh1.rotateX(Math.PI / 2)
		mesh1.translateZ(-1 * BLING_CITY_HEIGHT / 2)
		const rotation1 = computeRotation(mesh1.position, vecPosition)
		mesh1.rotateX(rotation1.x)
		mesh1.rotateY(rotation1.y)
		mesh1.rotateZ(rotation1.z)
		mesh1.position.normalize()
		mesh1.translateY(-1 * radius - BLING_CITY_HEIGHT / 2)

		// let axis = mesh1.position.clone()
		// let mesh2 = mesh1.clone()
		// mesh2.rotateOnAxis(axis.normalize(), Math.PI / 2)
		// mesh2.rotateOnAxis(axis.normalize(), Math.PI / -2)


		let mesh2 = new THREE.Mesh(geometry, material)

		mesh2.rotateX(Math.PI / 2)
		mesh2.translateZ(-1 * BLING_CITY_HEIGHT / 2)
		mesh2.rotateZ(Math.PI / 2)

		// setPosition(mesh2, position)
		

		// const rotation2 = computeRotation(mesh2.position, vecPosition)
		// mesh2.rotateX(rotation2.x)
		// mesh2.rotateY(rotation2.y)
		// mesh2.rotateZ(rotation2.z)
		// mesh2.position.normalize()
		// mesh2.rotateY(Math.PI / 2)
		// mesh2.translateY(-1 * radius - BLING_CITY_HEIGHT / 2)
		// mesh2.translateX(mesh2.position.x - mesh1.position.x)
		// mesh2.translateZ(mesh2.position.z - mesh1.position.z)
		// mesh2.translateY(mesh2.position.y - mesh1.position.y)





		scene.add(mesh1)
		scene.add(mesh2)
	})
}

function animate () {
	requestAnimationFrame(animate)
  var delta = clock.getDelta()
  trackball.update(delta)
	renderer.render(scene, camera)
}

// 功能函数
function convertFromLnglatToVec3 (lnglat) {
	const lng = lnglat[0]
	const lat = lnglat[1]
	const phi = (180 - lng) * (Math.PI / 180)
	const theta = (90 + lat) * (Math.PI / 180)
	const x = radius * Math.sin(theta) * Math.cos(phi)
	const y = radius * Math.sin(theta) * Math.sin(phi)
	const z = radius * Math.cos(theta)

	return {x, y, z}
}

function setPosition (mesh, position) {
	// if (!mesh.isObject) {
	// 	console.error('mesh is not Object3D!')
	// 	return
	// }
	if (position.x === undefined || position.y === undefined || position.z === undefined) {
		console.error('position is unvalid!')
		return
	}
	mesh.position.x = position.x
	mesh.position.y = position.y
	mesh.position.z = position.z
}

function computeRotation (source, target) {
	const x = source.angleTo(new THREE.Vector3(0, target.y, target.z))      
	const y = source.angleTo(new THREE.Vector3(target.x, 0, target.z))
	const z = source.angleTo(new THREE.Vector3(target.x, target.y, 0))
	return {x, y, z}
}