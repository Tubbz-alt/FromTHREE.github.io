# DrawMode 常量 #
Mesh.drawMode的取值，控制发送到GPU中的顶点列表如何如理。
*只有当Mesh.geometry为BufferGeometry时起效，否则无效。*
## 绘制模式 ##
**`THREE.TrianglesDrawMode`**
默认取值，每三个连续的顶点会被处理为单独的三角形，如果顶点的数量不是3的整数倍，超出的顶点将会被忽略。
例如：(v0, v1, v2), (v2, v3, v5)
**`THREE.TriangleStripDrawMode`**
每个后续的三角形共享前一个三角形的后两个顶点。
例如：(v0, v1, v2), (v2, v1, v3), (v2, v3, v4)
**`THREE.TriangleFanDrawMode`**
所有的三角形共享第一个顶点。
例如：(v0, v1, v2), (v0, v2, v3), (v0, v3, v4)


