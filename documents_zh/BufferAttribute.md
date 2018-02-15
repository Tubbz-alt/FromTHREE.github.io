# BufferAttribute #
存储和BufferGeometry相关的属性（例如，顶点位置，面索引，法向量，颜色，UV等任何通用属性），这使得传输数据给GPU的时候更高效。
数据可以是任何长度的向量，向量的长度通过itemSize定义，通常情况下，传送一个index给以下方法，会自动将该向量乘以itemSize。
## 构造函数 ##
BufferGeometry(array, itemsize, normalized)
array - 类型数组，用来实例化buffer，这个数组的长度必须为itemSize*顶点数量。
itemSize - 一个顶点相关的属性值的长度。
normalized - （可选），指定缓冲区中的数据怎样映射到GLSL中。例如，如果array是一个UInt16Array，normalized为true，数组中的0-65535将会在GLSL中映射到0.0f-1.0f。如果Array是一个Int16Array，将会将数组中的-32767-32767映射到GLSL中的-1.0f-1.0f。如果normalized是false，array中的数值将会转换为包含准确数值的float，例如，32767将会转换为32767.0f。
## 属性 ##
** array **
在buffer中存储的数据
** count **
array.length / itemSize
** dynamic **
buffer是否是动态的，默认为false。
如果为false，GPU就会知道，这个buffer中的内容将会频繁使用但不会频繁改变，这和gl.STATIC_DRAW标志是一致的。
如果为true，GPU就会知道，这个buffer中的内容将会被频繁使用和改变，这和gl.DYNAMIC_DRAW标志是一致的。
** isBufferAttribute **
用来检测是否是或派生自BufferAttribute，默认为true，通常不应该被改变。
** itemSize **
存储在array中的向量的长度
** name **
attribute实例的可选名字，默认为空字符串。
** needsUpdate **
这个属性是否改变并且应该重新传给GPU的标志，当修改array数组的值时，应该置为true。设置为true的同时，也使得version的值增加。
** onUploadCallback **
当渲染器将属性数组传给GPU之后执行的回调函数。
** updateRange **
{offset， count}
offset - 默认为0，开始更新的位置。
count - 默认为-1，不使用更新范围。
可以用来更新存储的节点的部分属性，例如，只更新节点的颜色。
** uuid **
对象实例的UUID，是被自动分配的，不应该被编辑。
** version **
版本号，每次needsUpdate设置为true时都会增加。
## 方法 ##
** clone() **
返回bufferAttribute的copy。
** copyArray(array) **
复制给定的array（）
** copyAt(index1, bufferAttribute, index2) **
bufferAttribute[index2]开始复制到array[index1]中。
** copyColorsArray(colors) **
将一个rgb颜色数组复制到当前数组。
** copyIndicesArray(indices) **
将一个Face3 indices数组复制到当前数组。
** copyector2sArray(vectors) **
将一个Vector2数组复制到当前数组。
** copyVector3sArray(vectors) **
将一个Vector3数组复制到当前数组。
** copyVector4sArray(vectors) **
将一个Vector4数组复制到当前数组。
** getX(index),getY(index),getZ(index),getW(index) **
返回指定索引的几点的x/y/z坐标。
** onUpload(callback) **
设置onUploadCallback属性值。
在WebGL/Buffergeometry中，用来在buffer传送给GPU后释放内存。
** set(value, offset) **
value - 普通数组或类型数组，用以复制数据。
offset - （可选）数组中开始复制数据的位置。
调用TypedArray.set(value, offset)。
** setArray(array) **
用于设置TypedArray。
这个方法调用结束后，needsUpdate设置为true才会生效。
** setDynamic(value) **
设置dynamic的值。
** setX(index, x),setY(index, y),setZ(index, z),setW(index, z),setW(index, w), setXY(index, x, y),setXYZ(index, x, y, z),setXYZW(index, x, y, z, w) **
设置给定索引的坐标值。