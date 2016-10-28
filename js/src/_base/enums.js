// BLENDING EQUATIONS

var Equations = {
    100: "AddEquation",
    101: "SubtractEquation",
    102: "ReverseSubtractEquation",
    103: "MinEquation",
    104: "MaxEquation",
};

var BlendFactors = {
    200: "ZeroFactor",
    201: "OneFactor",
    202: "SrcColorFactor",
    203: "OneMinusSrcColorFactor",
    204: "SrcAlphaFactor",
    205: "OneMinusSrcAlphaFactor",
    206: "DstAlphaFactor",
    207: "OneMinusDstAlphaFactor",
    208: "DstColorFactor",
    209: "OneMinusDstColorFactor",
    210: "SrcAlphaSaturateFactor",
};

// MATERIAL CONSTANTS

var Side = {
    0: "FrontSide",
    1: "BackSide",
    2: "DoubleSide",
};

var Shading = {
    1: "FlatShading",
    2: "SmoothShading",
};

var Colors = {
    0: "NoColors",
    1: "FaceColors",
    2: "VertexColors",	
};

var BlendingMode = {
    0: "NoBlending",
    1: "NormalBlending",
    2: "AdditiveBlending",
    3: "SubtractiveBlending",
    4: "MultiplyBlending",
    5: "CustomBlending"
};

var DepthMode = {
    0: "NeverDepth",
    1: "AlwaysDepth",
    2: "LessDepth",
    3: "LessEqualDepth",
    4: "EqualDepth",
    5: "GreaterEqualDepth",
    6: "GreaterDepth",
    7: "NotEqualDepth",
};

// TEXTURE CONSTANTS

var Operations = {
    0: "MultiplyOperation",
    1: "MixOperation",
    2: "AddOperation",	
};

var MappingModes = {
    300: "UVMapping",
    301: "CubeReflectionMapping",
    302: "CubeRefractionMapping",
    303: "EquirectangularReflectionMapping",
    304: "EquirectangularRefractionMapping",
    305: "SphericalReflectionMapping",
    306: "CubeUVReflectionMapping",
    307: "CubeUVRefractionMapping",	
};

var WrappingModes = {
    1000: "RepeatWrapping",
    1001: "ClampToEdgeWrapping",
    1002: "MirroredRepeatWrapping",
};

var Filters = {
    1003: "NearestFilter",
    1004: "NearestMipMapNearestFilter",
    1005: "NearestMipMapLinearFilter",
    1006: "LinearFilter",
    1007: "LinearMipMapNearestFilter",
    1008: "LinearMipMapLinearFilter",
};

var DataTypes = {
    1009: "UnsignedByteType",
    1010: "ByteType",
    1011: "ShortType",
    1012: "UnsignedShortType",
    1013: "IntType",
    1014: "UnsignedIntType",
    1015: "FloatType",
    1025: "HalfFloatType",
};

var PixelTypes = {
    1016: "UnsignedShort4444Type",
    1017: "UnsignedShort5551Type",
    1018: "UnsignedShort565Type",
};

var PixelFormats = {
    1019: "AlphaFormat",
    1020: "RGBFormat",
    1021: "RGBAFormat",
    1022: "LuminanceFormat",
    1023: "LuminanceAlphaFormat",
};

// TODO: how to handle this?
// RGBEFormat: THREE.RGBAFormat, //1024;

var CompressedTextureFormats = {
    2001: "RGB_S3TC_DXT1_Format",
    2002: "RGBA_S3TC_DXT1_Format",
    2003: "RGBA_S3TC_DXT3_Format",
    2004: "RGBA_S3TC_DXT5_Format",
    2100: "RGB_PVRTC_4BPPV1_Format",
    2101: "RGB_PVRTC_2BPPV1_Format",
    2102: "RGBA_PVRTC_4BPPV1_Format",
    2103: "RGBA_PVRTC_2BPPV1_Format",
};

// Texture Encodings

var TextureEncodings = {
    3000: "LinearEncoding",
    3001: "sRGBEncoding",
    3007: "GammaEncoding",
    3002: "RGBEEncoding",
    3003: "LogLuvEncoding",
    3004: "RGBM7Encoding",
    3005: "RGBM16Encoding",
    3006: "RGBDEncoding",
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
    CompressedTextureFormats: CompressedTextureFormats,
    TextureEncodings: TextureEncodings,
};
