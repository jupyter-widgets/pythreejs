// BLENDING EQUATIONS

var Equations = [
    "AddEquation",
    "SubtractEquation",
    "ReverseSubtractEquation",
    "MinEquation",
    "MaxEquation",
];

var BlendFactors = [
    "ZeroFactor",
    "OneFactor",
    "SrcColorFactor",
    "OneMinusSrcColorFactor",
    "SrcAlphaFactor",
    "OneMinusSrcAlphaFactor",
    "DstAlphaFactor",
    "OneMinusDstAlphaFactor",
    "DstColorFactor",
    "OneMinusDstColorFactor",
    "SrcAlphaSaturateFactor",
];

// MATERIAL CONSTANTS

var Side = [
    "FrontSide",
    "BackSide",
    "DoubleSide",
];

var Shading = [
    "FlatShading",
    "SmoothShading",
];

var Colors = [
    "NoColors",
    "FaceColors",
    "VertexColors",
];

var BlendingMode = [
    "NoBlending",
    "NormalBlending",
    "AdditiveBlending",
    "SubtractiveBlending",
    "MultiplyBlending",
    "CustomBlending"
];

var DepthMode = [
    "NeverDepth",
    "AlwaysDepth",
    "LessDepth",
    "LessEqualDepth",
    "EqualDepth",
    "GreaterEqualDepth",
    "GreaterDepth",
    "NotEqualDepth",
];

// TEXTURE CONSTANTS

var Operations = [
    "MultiplyOperation",
    "MixOperation",
    "AddOperation",
];

var MappingModes = [
    "UVMapping",
    "CubeReflectionMapping",
    "CubeRefractionMapping",
    "EquirectangularReflectionMapping",
    "EquirectangularRefractionMapping",
    "SphericalReflectionMapping",
    "CubeUVReflectionMapping",
    "CubeUVRefractionMapping",
];

var WrappingModes = [
    "RepeatWrapping",
    "ClampToEdgeWrapping",
    "MirroredRepeatWrapping",
];

var Filters = [
    "NearestFilter",
    "NearestMipMapNearestFilter",
    "NearestMipMapLinearFilter",
    "LinearFilter",
    "LinearMipMapNearestFilter",
    "LinearMipMapLinearFilter",
];

var DataTypes = [
    "UnsignedByteType",
    "ByteType",
    "ShortType",
    "UnsignedShortType",
    "IntType",
    "UnsignedIntType",
    "FloatType",
    "HalfFloatType",
];

var PixelTypes = [
    "UnsignedShort4444Type",
    "UnsignedShort5551Type",
    "UnsignedShort565Type",
    "UnsignedInt248Type",
];

var PixelFormats = [
    "AlphaFormat",
    "RGBFormat",
    ["RGBAFormat", "RGBEFormat"], // RGBAFormat and RGBEFormat share value
    "LuminanceFormat",
    "LuminanceAlphaFormat",
    "DepthFormat",
    "DepthStencilFormat",
];

var DepthFormats = [
    "DepthFormat",
    "DepthStencilFormat",
];

var CompressedTextureFormats = [
    "RGB_S3TC_DXT1_Format",
    "RGBA_S3TC_DXT1_Format",
    "RGBA_S3TC_DXT3_Format",
    "RGBA_S3TC_DXT5_Format",
    "RGB_PVRTC_4BPPV1_Format",
    "RGB_PVRTC_2BPPV1_Format",
    "RGBA_PVRTC_4BPPV1_Format",
    "RGBA_PVRTC_2BPPV1_Format",
    "RGB_ETC1_Format",
];

// Texture Encodings

var TextureEncodings = [
    "LinearEncoding",
    "sRGBEncoding",
    "RGBEEncoding",
    "LogLuvEncoding",
    "RGBM7Encoding",
    "RGBM16Encoding",
    "RGBDEncoding",
    "GammaEncoding",
];

// WebGLRenderer constants

var CullFaceModes = [
    "CullFaceNone",
    "CullFaceBack",
    "CullFaceFront",
    "CullFaceFrontBack",
];

var FrontFaceDirection = [
    "FrontFaceDirectionCW",
    "FrontFaceDirectionCCW",
];

var ShadowTypes = [
    "BasicShadowMap",
    "PCFShadowMap",
    "PCFSoftShadowMap",
];

var ToneMappings = [
    "NoToneMapping",
    "LinearToneMapping",
    "ReinhardToneMapping",
    "Uncharted2ToneMapping",
    "CineonToneMapping",
];

// Animation constants

var LoopModes = [
    "LoopOnce",
    "LoopRepeat",
    "LoopPingPong",
];

var InterpolationModes = [
    "InterpolateDiscrete",
    "InterpolateLinear",
    "InterpolateSmooth",
];

var EndingModes = [
    "ZeroCurvatureEnding",
    "ZeroSlopeEnding",
    "WrapAroundEnding",
];

// Draw Mode Constants

var DrawModes = [
    "TrianglesDrawMode",
    "TriangleStripDrawMode",
    "TriangleFanDrawMode",
];


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
