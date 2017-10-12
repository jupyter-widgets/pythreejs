"""
This file auto-generated with generate-enums.js
Date: Fri Jun 02 2017 16:44:47 GMT+0200 (W. Europe Daylight Time)
"""


Equations = [
    'AddEquation',
    'SubtractEquation',
    'ReverseSubtractEquation',
    'MinEquation',
    'MaxEquation',
]

BlendFactors = [
    'ZeroFactor',
    'OneFactor',
    'SrcColorFactor',
    'OneMinusSrcColorFactor',
    'SrcAlphaFactor',
    'OneMinusSrcAlphaFactor',
    'DstAlphaFactor',
    'OneMinusDstAlphaFactor',
    'DstColorFactor',
    'OneMinusDstColorFactor',
    'SrcAlphaSaturateFactor',
]

Side = [
    'FrontSide',
    'BackSide',
    'DoubleSide',
]

Shading = [
    'FlatShading',
    'SmoothShading',
]

Colors = [
    'NoColors',
    'FaceColors',
    'VertexColors',
]

BlendingMode = [
    'NoBlending',
    'NormalBlending',
    'AdditiveBlending',
    'SubtractiveBlending',
    'MultiplyBlending',
    'CustomBlending',
]

DepthMode = [
    'NeverDepth',
    'AlwaysDepth',
    'LessDepth',
    'LessEqualDepth',
    'EqualDepth',
    'GreaterEqualDepth',
    'GreaterDepth',
    'NotEqualDepth',
]

Operations = [
    'MultiplyOperation',
    'MixOperation',
    'AddOperation',
]

MappingModes = [
    'UVMapping',
    'CubeReflectionMapping',
    'CubeRefractionMapping',
    'EquirectangularReflectionMapping',
    'EquirectangularRefractionMapping',
    'SphericalReflectionMapping',
    'CubeUVReflectionMapping',
    'CubeUVRefractionMapping',
]

WrappingModes = [
    'RepeatWrapping',
    'ClampToEdgeWrapping',
    'MirroredRepeatWrapping',
]

Filters = [
    'NearestFilter',
    'NearestMipMapNearestFilter',
    'NearestMipMapLinearFilter',
    'LinearFilter',
    'LinearMipMapNearestFilter',
    'LinearMipMapLinearFilter',
]

DataTypes = [
    'UnsignedByteType',
    'ByteType',
    'ShortType',
    'UnsignedShortType',
    'IntType',
    'UnsignedIntType',
    'FloatType',
    'HalfFloatType',
]

PixelTypes = [
    'UnsignedShort4444Type',
    'UnsignedShort5551Type',
    'UnsignedShort565Type',
    'UnsignedInt248Type',
]

PixelFormats = [
    'AlphaFormat',
    'RGBFormat',
    'RGBAFormat',
    'RGBEFormat',
    'LuminanceFormat',
    'LuminanceAlphaFormat',
    'DepthFormat',
    'DepthStencilFormat',
]

DepthFormats = [
    'DepthFormat',
    'DepthStencilFormat',
]

CompressedTextureFormats = [
    'RGB_S3TC_DXT1_Format',
    'RGBA_S3TC_DXT1_Format',
    'RGBA_S3TC_DXT3_Format',
    'RGBA_S3TC_DXT5_Format',
    'RGB_PVRTC_4BPPV1_Format',
    'RGB_PVRTC_2BPPV1_Format',
    'RGBA_PVRTC_4BPPV1_Format',
    'RGBA_PVRTC_2BPPV1_Format',
    'RGB_ETC1_Format',
]

TextureEncodings = [
    'LinearEncoding',
    'sRGBEncoding',
    'RGBEEncoding',
    'LogLuvEncoding',
    'RGBM7Encoding',
    'RGBM16Encoding',
    'RGBDEncoding',
    'GammaEncoding',
]

CullFaceModes = [
    'CullFaceNone',
    'CullFaceBack',
    'CullFaceFront',
    'CullFaceFrontBack',
]

FrontFaceDirection = [
    'FrontFaceDirectionCW',
    'FrontFaceDirectionCCW',
]

ShadowTypes = [
    'BasicShadowMap',
    'PCFShadowMap',
    'PCFSoftShadowMap',
]

ToneMappings = [
    'NoToneMapping',
    'LinearToneMapping',
    'ReinhardToneMapping',
    'Uncharted2ToneMapping',
    'CineonToneMapping',
]

LoopModes = [
    'LoopOnce',
    'LoopRepeat',
    'LoopPingPong',
]

InterpolationModes = [
    'InterpolateDiscrete',
    'InterpolateLinear',
    'InterpolateSmooth',
]

EndingModes = [
    'ZeroCurvatureEnding',
    'ZeroSlopeEnding',
    'WrapAroundEnding',
]

DrawModes = [
    'TrianglesDrawMode',
    'TriangleStripDrawMode',
    'TriangleFanDrawMode',
]
