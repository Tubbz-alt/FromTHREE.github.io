#Material材质常量#
这些常量定义了不同类型的材质的共有属性，除了*纹理组合操作*只在MeshBasicMaterial、MeshLambertMaterial和MeshPhongMaterial材质中生效。
## 面 ##
`THREE.FrontSide`
`THREE.BackSide`
`THREE.DoubleSide`
定义了哪个面将会被渲染 - 外面，里面或所有面，默认为外面。
## 颜色 ##
`THREE.NoColors`
`THREE.FaceColors`
`THREE.VertexColors`
NoColors - 默认值，将材质的颜色应用于所有面。
FaceColors - 根据Face3.color的值为面涂色。
VertextColors - 根据Face3.vertexColors的值为面涂色，这是个THREE.Colors数组，一个值为面中一个顶点的颜色。
## 混合模式 ##
`THREE.NoBlending`
`THREE.NormalBlending`
`THREE.AdditiveBlending`
`THREE.SubtractiveBlending`
`THREE.MultiplyBlending`
`THREE.CustomBlending`
这个值规定了源和目的材质的RGB和Alpha混合方程。
NormalBlending - 默认值
CustomBlending - 必须设置为Custom Blending Equations
## 深度模式 ##
`THREE.NeverDepth`
`THREE.AlwaysDepth`
`THREE.LessDepth`
`THREE.LessEqualDepth`
`THREE.GreaterEquationDepth`
`THREE.GreaterDepth`
`THREE.NotEqualDepth`
材质使用哪种深度函数将输入像素Z深度与当前Z深度缓冲区值进行比较。 如果比较结果为真，则将绘制像素。
NeverDepth - false。
AlwaysDepth - true。
LessDepth - 如果传入像素Z深度小于当前缓冲区Z深度，将返回true。
LessEqualDepth - 默认值，如果传入像素Z-depth小于或等于当前缓冲区Z-depth，则返回true。
GreaterEqualDepth - 如果输入像素Z深度大于或等于当前缓冲区Z深度，将返回true。
GreaterDepth - 如果传入像素Z深度大于当前缓冲区Z深度，将返回true。
NotEqualDepth - 如果输入像素Z深度不等于当前缓冲区Z深度，则将返回true。
## 纹理组合操作 ##
`THREE.MultiplyOperation`
`THREE.MixOperation`
`THREE.AddOperation`
这个量定义了物体表面的颜色和环境贴图如何组合，这一常量仅对MeshBasicMaterial、MeshLambertMaterial和MeshPhongMaterial材质有效。
MultiplyOperation - 默认值，将环境贴图颜色和物体表面颜色相乘。
MixOperation - 使用反射率在两种颜色之间混合。
AddOperation - 两种颜色相加。