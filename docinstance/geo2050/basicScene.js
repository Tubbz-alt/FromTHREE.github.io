const radius = 50
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
	mesh.position.x = pos.x || 0
	mesh.position.y = pos.y || 0
	mesh.position.z = pos.z || 0
	return mesh
}

function createTextureCircle (r, segments, lnglat, url) {
	let geometry = new THREE.CircleGeometry(r, segments)
	let texture = new THREE.TextureLoader().load(url)
	let material = new THREE.MeshPhongMaterial()
	material.map = texture
	console.log(material)
	let mesh = new THREE.Mesh(geometry, material)
	let position = convertFromLnglatToVec3(lnglat)
	mesh.position.x = position.x
	mesh.position.y = position.y
	mesh.position.z = position.z
	return mesh
}

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

function createLinesMesh (lines) {
	lines.forEach((line, i) => {
		const length = line.length
		let vertices = new Float32Array(length * 3)
		let bufferGeom = new THREE.BufferGeometry()
		line.forEach((lnglat, i) => {
			const pos = convertFromLnglatToVec3(lnglat)
			vertices[i * 3] = pos.x
			vertices[i * 3 + 1] = pos.y
			vertices[i * 3 + 2] = pos.z
		})
		bufferGeom.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
		let material = new THREE.MeshBasicMaterial({
			// color: 0x02e095
			color: 0xffff00
		})
		let mesh = new THREE.Mesh(bufferGeom, material)
		scene.add(mesh)
	})
}

function animate () {
	requestAnimationFrame(animate)
  var delta = clock.getDelta()
  trackball.update(delta)
	renderer.render(scene, camera)
}