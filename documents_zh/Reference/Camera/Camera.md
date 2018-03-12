# Camera #
相机的虚基类，所有的相机都继承自这个类。
## 构造函数 ##
** Camera() **
这个类不是用来直接调用去创建一个相机的，我们常常创建的是透视相机（PerspectiveCamera）或正交相机（OrthographicCamera）等相机。
## 属性 ##
** isCamera **
检测当前类或派生类是否是相机，默认为true，这个值被渲染器在内部用来做优化，不应该手动改变。
** layers **
相机所在的layers，这个属性继承自Object3D。
++*当相机的视点被渲染时，对象必须与相机共享至少一层。*++
** matrixWorldInverse **
matrixWorld的逆矩阵，matrixWorld包含一个相机的世界坐标系转换的矩阵。
** projectionMatrix **
投影矩阵
## 方法 ##
** clone() **
返回一个和当前相机属性相同的新相机。
** copy(source) **
将source相机的属性拷贝到当前相机。
** getWorldDirection(optionalTarget) **
返回一个Vector3，这个向量表示相机在世界坐标系中看向的方向。
++*和Object3D的getWorldDirection不同，返回值不是相机的正面，而是沿着z轴的负方向。*++
++*如果参数向量是指定的，结果将会拷贝到该向量上，否则会返回一个新的向量。*++



