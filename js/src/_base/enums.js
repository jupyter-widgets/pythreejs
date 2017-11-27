//
// This file auto-generated with generate-enums.js
// Date: Wed Nov 15 2017 17:14:48 GMT+0100 (W. Europe Standard Time)
//


var Equations = {
    100: 'AddEquation',
    101: 'SubtractEquation',
    102: 'ReverseSubtractEquation',
    103: 'MinEquation',
    104: 'MaxEquation',
};

var BlendFactors = {
    200: 'ZeroFactor',
    201: 'OneFactor',
    202: 'SrcColorFactor',
    203: 'OneMinusSrcColorFactor',
    204: 'SrcAlphaFactor',
    205: 'OneMinusSrcAlphaFactor',
    206: 'DstAlphaFactor',
    207: 'OneMinusDstAlphaFactor',
    208: 'DstColorFactor',
    209: 'OneMinusDstColorFactor',
    210: 'SrcAlphaSaturateFactor',
};

var Side = {
    0: 'FrontSide',
    1: 'BackSide',
    2: 'DoubleSide',
};

var Shading = {
    1: 'FlatShading',
    2: 'SmoothShading',
};

var Colors = {
    0: 'NoColors',
    1: 'FaceColors',
    2: 'VertexColors',
};

var BlendingMode = {
    0: 'NoBlending',
    1: 'NormalBlending',
    2: 'AdditiveBlending',
    3: 'SubtractiveBlending',
    4: 'MultiplyBlending',
    5: 'CustomBlending',
};

var DepthMode = {
    0: 'NeverDepth',
    1: 'AlwaysDepth',
    2: 'LessDepth',
    3: 'LessEqualDepth',
    4: 'EqualDepth',
    5: 'GreaterEqualDepth',
    6: 'GreaterDepth',
    7: 'NotEqualDepth',
};

var Operations = {
    0: 'MultiplyOperation',
    1: 'MixOperation',
    2: 'AddOperation',
};

var MappingModes = {
    300: 'UVMapping',
    301: 'CubeReflectionMapping',
    302: 'CubeRefractionMapping',
    303: 'EquirectangularReflectionMapping',
    304: 'EquirectangularRefractionMapping',
    305: 'SphericalReflectionMapping',
    306: 'CubeUVReflectionMapping',
    307: 'CubeUVRefractionMapping',
};

var WrappingModes = {
    1000: 'RepeatWrapping',
    1001: 'ClampToEdgeWrapping',
    1002: 'MirroredRepeatWrapping',
};

var Filters = {
    1003: 'NearestFilter',
    1004: 'NearestMipMapNearestFilter',
    1005: 'NearestMipMapLinearFilter',
    1006: 'LinearFilter',
    1007: 'LinearMipMapNearestFilter',
    1008: 'LinearMipMapLinearFilter',
};

var DataTypes = {
    1009: 'UnsignedByteType',
    1010: 'ByteType',
    1011: 'ShortType',
    1012: 'UnsignedShortType',
    1013: 'IntType',
    1014: 'UnsignedIntType',
    1015: 'FloatType',
    1016: 'HalfFloatType',
};

var PixelTypes = {
    1017: 'UnsignedShort4444Type',
    1018: 'UnsignedShort5551Type',
    1019: 'UnsignedShort565Type',
    1020: 'UnsignedInt248Type',
};

var PixelFormats = {
    1021: 'AlphaFormat',
    1022: 'RGBFormat',
    1023: 'RGBAFormat',
    1024: 'LuminanceFormat',
    1025: 'LuminanceAlphaFormat',
    1026: 'DepthFormat',
    1027: 'DepthStencilFormat',
};

var DepthFormats = {
    1026: 'DepthFormat',
    1027: 'DepthStencilFormat',
};

var CompressedTextureFormats = {
    2001: 'RGB_S3TC_DXT1_Format',
    2002: 'RGBA_S3TC_DXT1_Format',
    2003: 'RGBA_S3TC_DXT3_Format',
    2004: 'RGBA_S3TC_DXT5_Format',
    2100: 'RGB_PVRTC_4BPPV1_Format',
    2101: 'RGB_PVRTC_2BPPV1_Format',
    2102: 'RGBA_PVRTC_4BPPV1_Format',
    2103: 'RGBA_PVRTC_2BPPV1_Format',
    2151: 'RGB_ETC1_Format',
};

var TextureEncodings = {
    3000: 'LinearEncoding',
    3001: 'sRGBEncoding',
    3002: 'RGBEEncoding',
    3003: 'LogLuvEncoding',
    3004: 'RGBM7Encoding',
    3005: 'RGBM16Encoding',
    3006: 'RGBDEncoding',
    3007: 'GammaEncoding',
};

var CullFaceModes = {
    0: 'CullFaceNone',
    1: 'CullFaceBack',
    2: 'CullFaceFront',
    3: 'CullFaceFrontBack',
};

var FrontFaceDirection = {
    0: 'FrontFaceDirectionCW',
    1: 'FrontFaceDirectionCCW',
};

var ShadowTypes = {
    0: 'BasicShadowMap',
    1: 'PCFShadowMap',
    2: 'PCFSoftShadowMap',
};

var ToneMappings = {
    0: 'NoToneMapping',
    1: 'LinearToneMapping',
    2: 'ReinhardToneMapping',
    3: 'Uncharted2ToneMapping',
    4: 'CineonToneMapping',
};

var LoopModes = {
    2200: 'LoopOnce',
    2201: 'LoopRepeat',
    2202: 'LoopPingPong',
};

var InterpolationModes = {
    2300: 'InterpolateDiscrete',
    2301: 'InterpolateLinear',
    2302: 'InterpolateSmooth',
};

var EndingModes = {
    2400: 'ZeroCurvatureEnding',
    2401: 'ZeroSlopeEnding',
    2402: 'WrapAroundEnding',
};

var DrawModes = {
    0: 'TrianglesDrawMode',
    1: 'TriangleStripDrawMode',
    2: 'TriangleFanDrawMode',
};

module.exports = {
    Equations: Equations,
    BlendFactors: BlendFactors,
    Side: Side,
    Shading: Shading,
    Colors: Colors,
    BlendingMode: BlendingMode,
    DepthMode: DepthMode,
    Operations: Operations,
    MappingModes: MappingModes,
    WrappingModes: WrappingModes,
    Filters: Filters,
    DataTypes: DataTypes,
    PixelTypes: PixelTypes,
    PixelFormats: PixelFormats,
    DepthFormats: DepthFormats,
    CompressedTextureFormats: CompressedTextureFormats,
    TextureEncodings: TextureEncodings,
    CullFaceModes: CullFaceModes,
    FrontFaceDirection: FrontFaceDirection,
    ShadowTypes: ShadowTypes,
    ToneMappings: ToneMappings,
    LoopModes: LoopModes,
    InterpolationModes: InterpolationModes,
    EndingModes: EndingModes,
    DrawModes: DrawModes,
};
