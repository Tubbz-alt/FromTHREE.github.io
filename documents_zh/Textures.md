# Textures纹理 #
## 映射模式 ##
`THREE.UVMapping`
`THREE.CubeReflectionMapping`
`THREE.CubeRefractionMapping`
`THREE.EquirectangularReflectionMapping`
`THREE.EquirectangularRefractionMapping`
`THREE.SphericalReflectionMapping`
`THREE.CubeUVReflectionMapping`
`THREE.CubeUVRefractionMappin`
定义了纹理的映射模式。
默认为`UVMapping`，映射纹理使用的是网格的UV坐标。
剩下的常量定义了环境贴图类型。
`CubeReflectionMapping`和`CubeRefractionMapping`专用于CubeTexture，这种纹理由6个纹理组成，每个纹理映射到立方体的一个面上。`CubeReflectionMapping`是CubeTexture的默认值。
`EquirectangularReflectionMapping`和`EquirectangularRefractionMapping`用于equirectangular环境贴图，也被称为是lat-long贴图。一个equirectangular贴图，表示沿水平中心线的360度视图，以及沿垂直轴的180度视图，顶部和底部边缘对应于北极和南极。
`SphericalReflectionMapping`球面反射映射用于球面反射映射，例如可以通过裁剪镜像球的照片来获得球面反射映射。无论相机相对于立方体贴图对象或表面的位置如何，球面贴图都将被渲染为“面向”相机。
## Wrapping Modes ##
`THREE.RepeatWrapping`
`THREE.ClampToEdgeWrapping`
`THREE.MirroredRepeatWrapping`
定义了纹理的wrapS和wrapT属性，这些属性定义了水平和垂直纹理环绕方式。
RepeatWrapping - 纹理无线重复贴图
ClampToEdgeWrapping - 纹理的最后一个像素拉伸到网格的边缘
MirroredRepeatWrapping - the texture will repeats to infinity, mirroring on each repeat.
## Magnification Filters ##
`THREE.NearestFilter`
`THREE.LinearFilter`
用于magFilter属性，定义了当纹理像素映射到小于或等于一个纹理元素（texel）的区域时要使用的纹理放大函数。
NearestFilter - 返回纹理元素最接近（Manhattan距离）纹理坐标的值。
LinearFilter - 默认，返回最接近指定纹理坐标的四个纹理元素的加权平均值，并且可以包括纹理的其他部分，具体取决于wrapS和wrapT的值以及具体的映射。
## Minification Filters ##
`THREE.NearestFilter`
`THREE.NearestMipMapNearestFilter`
`THREE.NearestMipMapLinearFilter`
`THREE.LinearFilter`
`THREE.LinearMipMapNearestFilter`
`THREE.LinearMipMapLinearFilter`
用于纹理的minFilter属性，这些定义了纹理缩小功能，当纹理像素映射到大于一个纹理元素的区域时使用该纹理缩小功能。
除了NearestFilter和LinearFilter，其他都可用于纹理缩小。
NearestMipMapNearestFilter - 选择最接近纹理像素大小的纹理贴图，并使用NearestFilter准则（最接近像素中心的纹理）生成纹理值。
NearestMipMapLinearFilter - 选择两个最接近纹理像素大小的纹理贴图，用NearestFilter标准，从每个贴图中生成一个纹理贴图。最终的纹理值，是这两个纹理贴图的加权平均值。
LinearMipMapNearestFilter - 选择一个最接近纹理像素大小的纹理贴图，用LinearFilter标准（四个最接近像素中心的纹理贴图的加权平均值）生成纹理值。
LinearMipMapLinearFilter - 选择两个最接近纹理像素大小的纹理贴图，用LinearFilter标准（四个最接近像素中心的纹理贴图的加权平均值）生成纹理值。
## 类型 ##
`THREE.UnsignedByteType`
`THREE.ByteType`
`THREE.ShortType`
`THREE.UnsignedShortType`
`THREE.IntType`
`THREE.UnsignedIntType`
`THREE.FloatType`
`THREE.HalfFloatType`
`THREE.UnsignedShort4444Type`
`THREE.UnsignedShort5551Type`
`THREE.UnsignedShort565Type`
`THREE.UnsignedInt248Type`
默认值为UnsignedByteType，这一特性和正确的格式是一一对应的。
## 格式 ##
`THREE.AlphaFormat`
`THREE.RGBFormat`
`THREE.RGBAFormat`
`THREE.LuminanceFormat`
`THREE.LuminanceAlphaFormat`
`THREE.RGBEFormat`
`THREE.DepthFormat`
`THREE.DepthStencilFormat`
用于纹理的format属性，定义了2d纹理或纹理元素怎样被shader读取。
AlphaFormat - 忽略rgb只读取alpha，对应的纹理类型必须为UnsignedByteType。
RGBAFormat - 默认值，读取rgba，纹理类型必须为 UnsignedByteType, UnsignedShort4444Type或 THREE.UnsignedShort5551Type.
LuminaceFormat - 每个元素被看所一个单独的亮度组件，然后转换为一个0到1之间的浮点数，通过将亮度置于红绿蓝通道中，Alpha通道设置为1，从而组装为一个RGBA元素。该纹理的类型必须为UnsignedByteType。
LuninanceAlphaFormat - 将每个元素读取为亮度/透明度值，接下来的处理和LuminanceFormat类似，但alpha通道的值不能为1.0，纹理类型必须为UnsignedByteType。
RGBEFormat - 和RGBAFormat完全相同。
DepthFormat - 将每个元素读取为一个单独的深度值，将其转换为一个浮点数，映射到0-1之间。纹理类型必须为UnsignedIntType或UnsignedShortType。是DepthTexture的默认值。
DepthStencilFormat - 每个元素读作一对深度和模板值，其中，深度值解读为DepthFormat，模板组件基于depth+stencil来解读。纹理类型必须为UnsignedInt248Type。
## DDS/ST3C压缩的纹理格式 ##
`THREE.RGB_S3TC_DXT1_Format`
`THREE.RGBA_S3TC_DXT1_Format`
`THREE.RGBA_S3TC_DXT3_Format`
`THREE.RGBA_S3TC_DXT5_Format`
这一属性需要浏览器支持WEBGL_compressed_texture_pvrtc扩展。
较少的设备支持这一扩展，PVRTC通常只有在有PowerVR芯片移动设备上（主要为Apple设备）支持。
RGB_PVRTC_4BPPV1_Format - RGB压缩为4bit模式，每个block为4*4像素。
RGB_PVRTC_2BPPV1_Format - RGB压缩为2bit模式，每个block为8*4像素。
RGBA_PVRTC_4BPPV1_Format - RGBA压缩为4bit模式，每个block为4*4像素。
RGB_PVRTC_2BPPV1_Format - RGBA压缩为2bit模式，每个block为8*4像素。
## ETC压缩纹理格式 ##
需要WEBGL_compressed_texture_etc1扩展，大部分设备不支持。
## 编码 ##
`THREE.LinearEncoding`
`THREE.sRGBEncoding`
`THREE.GammaEncoding`
`THREE.RGBEEncoding`
`THREE.LogLuvEncoding`
`THREE.RGBM7Encoding`
`THREE.RGBM16Encoding`
`THREE.RGBDEncoding`
`THREE.BasicDepthPacking`
`THREE.RGBADepthPacking`
纹理的编码属性。
如果这一属性在纹理被材质使用后改变，必须手动更新Material.needsUpdate为true才能使该材质重新编译生效。
LinearEncoding - 默认值，其他值仅在材质的map,envMap和emmissiveMap时生效。