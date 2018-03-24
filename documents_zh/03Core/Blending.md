# Blending Equation Constants #
混合方程适合于所有的材质，首先设置材质的混合模式为THREE.CustomBlending，然后设置期望的混合方程、源混合模式、目的混合模式。
** 混合方程 **
`THREE.AddEquation`
`THREE.SubtractEquation`
`THREE.ReverseSubtractEquation`
`THREE.MinEquation`
`THREE.MaxEqaution`
** 源因子(source factors) **
`THREE.ZeroFactor`
`THREE.OneFactor`
`THREE.SrcColorFactor`
`THREE.OneMinusSrcColorFactor`
`THREE.SrcAlphaFactor`
`THREE.OneMinusSrcAlphaFactor`
`THREE.DstAlphaFactor`
`THREE.OneMinusDstAlphaFactor`
`THREE.DstColorFactor`
`THREE.OneMinusDstColorFactor`
`THREE.SrcAlphaSaturateFactor`
** 目的因子(destination factors) **
source factors中的所有值都是可用的，除了`THREE.SrcAlphaSaturateFactor`