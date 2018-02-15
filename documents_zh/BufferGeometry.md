#BufferGeometry#
这个类是`Geometry`的高效替代选择。它存储了所有的数据，包括顶点位置，face indices，法向量，颜色，UV，以及包括缓冲区在内的通用属性。它也减少了将数据传送给GPU的代价。
同时，这也让处理BufferGeometry比Geometry更麻烦。除了需要将位置数据看做是Vector3对象，颜色数据看做Color对象，还必须接收合理的属性buffer作为原始数据。因此，BufferGeometry适合于实例化之后不需要频繁操作的静态对象。
## Accessing Attributes ##
WebGL将geometry相关的单独顶点数据存储在`attributes`中。包括顶点的位置、法向量vector，颜色等等。当使用Geometry时，渲染器会将这些信息打包为`typed array`（类型数组）并传给着色器shader。对于BufferGeometry来说，所有的这些数据都存储在一个和各个属性相关联的缓冲区中。这意味着，如果你想得到一个顶点的位置数据，需要调用`getAttribute`来访问position属性，然后才能访问真正的坐标位置数据。
**position(itemSize: 3)**
存储每个顶点的x,y,z坐标，可以通过`fromGeometry`设置。
**normal(itemSize: 3)**
存储每个顶点的法向量的x,y,z坐标，可以通过`fromGeometry`设置。
**color(itemSize: 3)**
存储每个顶点的r,g,b通道值，可以通过`fromGeometry`设置。
**index(itemSize: 1)**
允许顶点可以被多个三角形重用，当使用索引三角形时被调用，何在Geometry中的工作方式类似：每个三角形由三个顶点组成。因此，这个属性存储构成每个三角形面的顶点的索引。如果这个属性没有被设置，渲染器会假定每三个连续的顶点构成一个单独的三角形。
_除了上述内置的属性外，也可以通过`addAttribute`方法设置你自己的通用属性。在Geometry中，这些属性在材质中设置和存储。在BufferGeometry中，这些属性存储在geometry自身，同时，依然需要为材质设置属性，但是所有的属性都存储在BufferGeometry上。_
## 构造函数 ##
BufferGeometry()
## 属性 ##
** attributes **
这是一个hashmap，存储着属性的名称和value buffer，不能直接获取属性值，需要通过`addAttribute`和`getAttribute`来获取geometry的属性（得到的是一个类型数组typed array）。
** boundingBox **
包围盒，可以通过`computeBoundingBox`来计算得到，默认为null。
** boundingSphere **
包围球，可以通过`comoouteBoundingSphere`来计算得到，默认为null。
** drawRange{start：0， count： Infinity} **
用来决定geometry的哪部分应该被渲染出来，不应该直接设置，应该通过`setDrawRange`来设置。
** groups **
将geometry分组，每个组将会被独立的WebGL绘制函数调用，允许一个材质的数组和一个bufferGeometry一起使用。
每个组的形式如下：
{start：Integer， count： Integer， materialIndex： Integer}
start - 制定了绘制函数调用的第一个顶点的索引
count - 制定了这个组包含多少个顶点
materialIndex - 指定使用的材质的索引
使用`addGroup`来增加分组，而不是直接修改这个数组。
** id **
number，bufferGeometry实例的唯一标识。
** index **
见Accessing Attributes
** isBufferGeometry **
检测是否是或是否派生自BufferGeometry，默认为true，不应当被改变。
** morphAttributes **
BufferAttributes的hashmap，包含geometry的morphTargets的细节。
** name **
bufferGeometry实例的名字，可选，默认为空字符串。
** uuid **
实例的UUID，被自动赋值，不应该被改变。
## 方法 ##
*EventDispatcher*方法在该类上是可用的。
** addAttribute(name, attribute) **
为这个geometry增加一个属性，使用这一函数而不是直接修改attributes属性，是因为geometry内部维护了一个attributes的hashmap来加速属性的迭代。
** addGroup(start, count, materialIndex) **
为geometry增加一个组，具体查看groups。
** applyMatrix(matrix) **
bakes matrix直接转换为顶点坐标。
** center() **
根据包围盒使geometry居中。
** clone() **
创建BufferGeometry的副本。
** copy(bufferGeometry) **
将另一个bufferGeometry的属性拷贝到当前bufferGeometry。
** clearGroups() **
清除所有的组。
** computeBoundingBox() **
计算geometry的包围盒，更新boundingBox属性，包围盒默认是不计算的，需要特别计算，否则为null。
** computeBoundingSphere() **
计算geometry的包围球，更新boundingSphere属性，包围球默认是不计算的，需要特别计算，否则为null。
** computeVertexNormals() **
通过平均面法向量来计算顶点法向量。
** dispose() **
从内存中分配对象。当应用在运行时，想要移除bufferGeometry就要调用该函数。
** fromDirectGeometry(Geometry) **
通过DirectGeometry对象的数据生成BufferGeometry。
_DirectGeometry是一个中间对象，主要用来在Geometry和BufferGeometry之间的转换。_
** fromGeometry(Geometry) **
从Geometry对象生成一个BufferGeometry。
** getAttribute(name) **
返回指定名称的属性。
** getIndex() **
返回index buffer。
** lookAt(vector) **
vector - 世界坐标系中的向量
将geometry旋转至朝向空间中的一个点，一次性操作，不是一个循环。实时的网格操作使用Object3D.lookAt。
** merge(bufferGeometry, offset) **
在一个BufferGeometry中合并另一个BufferGeometry，offset为开始合并的偏移量。
** normalizeNormals() **
法向量单位化，这将纠正几何表面的光照。
** removeAttribute(name) **
移除指定名称的属性。
** rotateX(radians) **
沿着X轴旋转geometry，参数为弧度，一次性操作，Object3D.rotation用来做实时旋转。
** rotateY(radians) **
沿着Y轴旋转geometry，参数为弧度，一次性操作，Object3D.rotation用来做实时旋转。
** rotateZ(radians) **
沿着Z轴旋转geometry，参数为弧度，一次性操作，Object3D.rotation用来做实时旋转。
** scale(x,y,z) **
放大geometry数据，一次性操作，Object3D.rotation用来做实时旋转。
** setIndex(index) **
设置index buffer。
** setDrawRange(start, count) **
设置drawRange buffer。
** setFromObject(object) **
根据传入的Object3D对象，设置BufferGeometry的属性。
** setFromPoints(points) **
根据points数组设置BufferGeometry的属性。
** toJSON() **
返回BufferGeometry的JOSN表示。
** toNonIndexed() **
返回一个索引BufferGeometry的非索引版本。
** translate(x, y, z) **
平移geometry，一次性操作，Object3D.rotation用来做实时旋转。
** updateFromObject(object) **
根据传入的Object3D对象，更新BufferGeometry的属性。


