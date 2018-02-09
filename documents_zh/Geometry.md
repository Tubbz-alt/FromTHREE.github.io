# Geometry #
除BufferGeometry外所有geometry的基类，也可以直接用于新建一个通用的geometry。Geometry比BufferGeometry容易处理，因为Geometry直接存储顶点，颜色，faces等，而不是在buffer中存储，但是Geometry也相对更慢一些。
## 构造函数 ##
Geometry()不需要参数
## 属性 ##
** boundingBox **
默认为null，可以通过computeBoundingBox来计算
** boundingSphere **
默认为null，可以通过computeBoundingSphere来计算
** colors **
顶点颜色数组，和顶点的顺序、数量对应。
用于Points和Line及由此派生的类，例如LineSegments，各种helpers。Mesh用Face3.vertexColors而不是这个属性。
要想使这个属性的改变生效，Geometry.colorsNeedUpdate应该设置为true。
** faces **
faces数组。
描述了顶点是怎样形成一个面的，除此之外，还包含了面和顶点的法向量和颜色信息。
要想使这个属性的改变生效，Geometry.colorsNeedUpdate应该设置为true。
** faceVertexUvs **
面UV层数组，用以将纹理映射到geometry上。每个UV层都是一个UVs数组，UVs和面中顶点的数量和顺序是一致的。
** id **
id
** isGeometry **
检测是否为Geometry或派生自Geometry，默认为true，不应该被改变。
** lineDistances **
数组，存储Line Geometry的顶点之间的距离，是LineSegments/LineDashedMaterial正确渲染所必须的。可以通过computeLineDistances自动计算出来。
** morphTargets **
morphTargets数组，每个元素都是一个js对象：
`{ name: "targetName", vertices: [ new THREE.Vector3(), ... ] }`
** morphNormals **
morph normals数组，每个元素都是一个js对象：
`{ name: "NormalName", vertices: [ new THREE.Vector3(), ... ] }`
** name **
geometry的名称，默认为空字符串
** skinWeights **
当使用SkinnedMesh时，每个顶点最多可以被4个bone可以影响到。skinWeights属性是一个权重数组，数组中权重的顺序和geometry中顶点的顺序一致。例如，第一个skinWeight值应该属于geometry中第一个顶点。由于每个顶点可以被4个bone影响到，所以顶点的skin weight是由Vector4来表示的。
顶点的skin weight值是一个Vector4向量，向量的每个分量应该在0-1之间，值为0表示bone的移动对顶点没有影响；值为0.5，则有50%的影响；值为1时，影响为100%。如果只有一个bone和顶点相关，只需要关注向量的第一个分量即可，其他值都为0，可以忽略。
** skinIndices **
和skinWeights属性类似，skinIndices属性和geometry的顶点相关。每个顶点最多有4个bone相关，每个顶点的每个skinIndex值描述的就是和该顶点相关的bone。例如，第一个顶点(10.05,30.10,12.12)，第一个skinIndex为(10,2,0,0)，skinWeights的第一个值为(0.8,0.2,0,0)，skeleton.bones[10]将会对顶点有80%的影响，skeleton[2]将会对顶点有20%的影响。剩余两个值为0，相应的bone不会对顶点产生任何影响。
** uuid **
geometry的UUID。
** vertices **
顶点数组。
存储顶点的位置，改变时，需要更新verticesNeedsUpdate为true。
** verticesNeedUpdate **
顶点数组更新时需要设置为true。
** elementsNeedUpdate **
faces数组更新时需要设置为true。
** uvsNeedUpdate **
uvs数组更新时需要设置为true。
** normalsNeedUpdate **
法向量数组更新时需要设置为true。
** colorsNeedUpdate **
face3颜色数组更新时需要设置为true。
** groupsNeedUpdate **
face3的材质索引更新时需要设置为true。
** lineDistancesNeedUpdate **
linedistances数组更新时需要设置为true。
## 方法 ##
** applyMatrix(matrix) **
Bakes matrix transform directly into vertex coordinates.
** center)() **
基于包围盒居中geometry。
** clone() **
生成一个geometry的副本。
_仅复制顶点，faces，uvs。_
** computeBoundingBox() **
计算geometry的包围盒，更新Geometry.boundingBox属性。
** comouteBoundingSphere() **
计算geometry的包围球，更新Geometry.boundingSphere属性。
** computeFaceNormals() **
计算面法向量。
** computeFlatVertextNormals() **
根据面法向量计算顶点法向量，每个面的各个顶点的法向量都为该面的法向量。
** computeLineDistances() **
计算lineDistance属性。
** computeMorphNormals() **
计算morphNormals属性
** computeVertextNormals(areaWeighted) **
areaWeighted - boolean,如果为true，每个面法向量对顶点法向量的贡献取决于其面积，默认为true。
通过平均面法向量来计算顶点法向量。
** copy(geometry) **
将指定geometry的顶点，faces和uvs复制到当前geometry，其他属性不会复制。
** dispose() **
移除内存中的object。
在移除一个geometry后，要调用这个方法，否则会导致内存泄露。
** fromBufferGometry(geometry) **
将一个BufferGeometry转换为Geometry。
** lookAt(vector) **
vector - 世界坐标系向量。
旋转geometry看向空间中的一点，通常是一次性操作，但不是在一个渲染循环中完成的。
** merge(geometry, matrix, materialIndexOffset) **
合并两个geometry。
** mergeMesh(mesh) **
将网格的几何体与此geometry融合，同时应用网格的变换。
** mergeVertices() **
用hashMap查找重复的顶点。
移除重复的顶点，更新face的顶点。
** normalized() **
标准化geometry。
居中geometry，geometry的包围球是一个半径为1的球。
** rotateX(radians),rotateY(radians),rotateZ(radians) **
绕x，y，z轴旋转geometry，通常为一个一次性操作而不是在渲染循环中，用Object3D.rotation做实时网格旋转。
** setFromPoints(points) **
通过传入的points数组设置Geometry的vertices。
** sortFacesByMaterialIndex() **
根据材质索引对faces排序，对于有多个材质的复杂geometry，可以减少绘制函数的调用，提升性能。
** scale(x, y, z) **
缩放geometry数据，通常为一个一次性操作而不是在渲染循环中，用Object3D.rotation做实时网格缩放。
** toJSON() **
将geometry转换为JSON格式。
** translate(x, y, z) **
平移geometry，通常为一个一次性操作而不是在渲染循环中，用Object3D.rotation做实时网格平移。


