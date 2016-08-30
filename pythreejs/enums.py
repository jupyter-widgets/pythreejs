r"""
Three.js Enums

These correspond to the enum property names in the THREE js object
"""

# Custom Blending Equation Constants
# http://threejs.org/docs/index.html#Reference/Constants/CustomBlendingEquation

Equations = [
    'AddEquation',
    'SubtractEquation',
    'ReverseSubtractEquation',
    'MinEquation',
    'MaxEquation'
]

DestinationFactors = [
    'ZeroFactor',
    'OneFactor',
    'SrcColorFactor',
    'OneMinusSrcColorFactor',
    'SrcAlphaFactor',
    'OneMinusSrcAlphaFactor',
    'DstAlphaFactor',
    'OneMinusDstAlphaFactor'
]

SourceFactors = [
    'DstColorFactor',
    'OneMinusDstColorFactor',
    'SrcAlphaSaturateFactor'
]

# Material Constants
# http://threejs.org/docs/index.html#Reference/Constants/Materials
Side = [
    'FrontSide',
    'BackSide',
    'DoubleSide'
]

Shading = [
    'FlatShading',
    'SmoothShading'
]

Colors = [
    'NoColors',
    'FaceColors',
    'VertexColors'
]

BlendingMode = [
    'NoBlending',
    'NormalBlending',
    'AdditiveBlending',
    'SubtractiveBlending',
    'MultiplyBlending',
    'CustomBlending'
]


# Texture Constants
# http://threejs.org/docs/index.html#Reference/Constants/Textures

Operations = [
    'MultiplyOperation',
    'MixOperation',
    'AddOperation'
]

MappingModes = [
    'UVMapping',
    'CubeReflectionMapping',
    'CubeRefractionMapping',
    'EquirectangularReflectionMapping',
    'EquirectangularRefractionMapping',
    'SphericalReflectionMapping'
]

WrappingModes = [
    'RepeatWrapping',
    'ClampToEdgeWrapping',
    'MirroredRepeatWrapping'
]

Filters = [
    'NearestFilter',
    'NearestMipMapNearestFilter',
    'NearestMipMapLinearFilter',
    'LinearFilter',
    'LinearMipMapNearestFilter',
    'LinearMipMapLinearFilter'
]

DataTypes = [
    'UnsignedByteType',
    'ByteType',
    'ShortType',
    'UnsignedShortType',
    'IntType',
    'UnsignedIntType',
    'FloatType',
    'HalfFloatType'
]

PixelTypes = [
    'UnsignedShort4444Type',
    'UnsignedShort5551Type',
    'UnsignedShort565Type'
]

PixelFormats = [
    'AlphaFormat',
    'RGBFormat',
    'RGBAFormat',
    'LuminanceFormat',
    'LuminanceAlphaFormat',
    'RGBEFormat'
]

CompressedTextureFormats = [
    'RGB_S3TC_DXT1_Format',
    'RGBA_S3TC_DXT1_Format',
    'RGBA_S3TC_DXT3_Format',
    'RGBA_S3TC_DXT5_Format',
    'RGB_PVRTC_4BPPV1_Format',
    'RGB_PVRTC_2BPPV1_Format',
    'RGBA_PVRTC_4BPPV1_Format',
    'RGBA_PVRTC_2BPPV1_Format'
]

# Misc

Lines = [
    'LineStrip',
    'LinePieces'
]

Renderers = [
    'webgl',
    'canvas',
    'auto'
]

