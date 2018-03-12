function getGeoFeatureTypes (data) {
	const features = data['features'] || []
	let typeMap = new Map()
	features.forEach(feature => {
		const geometry = feature.geometry
		if (geometry) {
			const type = geometry.type
			typeMap.get(type) ? typeMap.set(type, typeMap.get(type) + 1) : typeMap.set(type, 1)
		}
	})
	for (let [key, value] of typeMap.entries()) {
		console.log(key, value)
	}
	return typeMap
}

function parseLinesFromGeo (data) {
	const features = data['features'] || []
	let lines = []
	features.forEach(feature => {
		const geometry = feature.geometry
		const type = geometry ? geometry.type : ''
		const coordinates = geometry ? geometry.coordinates : []
		lines = lines.concat(parseLinesFromDeeperCoor(type, coordinates))
	})
	return lines
}

function parseLinesFromDeeperCoor (type, coordinates) {
	let lines = []
	coordinates.forEach(val => {
		if (type === 'Polygon') {
			lines.push(val)
		} else if (type === 'MultiPolygon') {
			val.forEach(innerPolygon => {
				lines.push(innerPolygon)
			})
		}
	})
	return lines
}
