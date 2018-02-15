# DirectGeometry #
这个类在内部用于从Geometry转换到BufferGeometry。
## 构造函数 ##
DirectGeometry()
## 属性 ##
id - 实例的id
name - 实例的名称，默认为空字符串
type - ‘DirectGeometry’
indices - 初始化为空数组，由fromGeometry()产生
vertices - 初始化为空数组，由fromGeometry()产生
normals - 初始化为空数组，由fromGeometry()产生
colors - 初始化为空数组，由fromGeometry()产生
uvs - 初始化为空数组，由fromGeometry()产生
groups - 初始化为空数组，由fromGeometry()产生
morphTargets - 初始化为空数组，由fromGeometry()产生
skinWeights - 初始化为空数组，由fromGeometry()产生
skinIndices - 初始化为空数组，由fromGeometry()产生
boundingSphere - bufferGeometry的包围球，默认为null，可以通过`computeBoundingSphere()`计算
boundingBox - bufferGeometry的包围盒，默认为null，可以通过`computeBoundingBox()`计算
verticesNeedUpdate - 默认为false
normalsNeedUpdate - 默认为false
colorsNeedUpdate - 默认为false
uvsNeedUpdate - 默认为false
groupsNeedUpdate - 默认为false
## 方法 ##
** computeBoundingBox() **
计算geometry的包围盒，更新Geometry.boundingBox
** computeBoundingSphere() **
计算geometry的包围球，更新Geometry.boudingSphere
** computeGroups(geometry) **
计算有不同的材质索引的geometry。
** dispose() **
从内存中释放对象
在应用程序运行时删除directGeometry时调用此方法。
** fromGeometry(geometry) **
传递一个geometry实例给会话。
