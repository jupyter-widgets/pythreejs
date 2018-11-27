"""
This file auto-generated with generate-enums.js
"""

class EnumNamespace:
    """A collection of enum values.

    This collection can be used as specification to traitlets.Enum
    as it supports the `in` operator, and also supports tab completion
    as the values are attributes.
    """
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __contains__(self, key):
        return key in self.__dict__

    def __repr__(self):
        return str(list(filter(lambda e: not e.startswith('_'), dir(self))))


Equations = EnumNamespace(
    AddEquation='AddEquation',
    SubtractEquation='SubtractEquation',
    ReverseSubtractEquation='ReverseSubtractEquation',
    MinEquation='MinEquation',
    MaxEquation='MaxEquation',
)

BlendFactors = EnumNamespace(
    ZeroFactor='ZeroFactor',
    OneFactor='OneFactor',
    SrcColorFactor='SrcColorFactor',
    OneMinusSrcColorFactor='OneMinusSrcColorFactor',
    SrcAlphaFactor='SrcAlphaFactor',
    OneMinusSrcAlphaFactor='OneMinusSrcAlphaFactor',
    DstAlphaFactor='DstAlphaFactor',
    OneMinusDstAlphaFactor='OneMinusDstAlphaFactor',
    DstColorFactor='DstColorFactor',
    OneMinusDstColorFactor='OneMinusDstColorFactor',
    SrcAlphaSaturateFactor='SrcAlphaSaturateFactor',
)

Side = EnumNamespace(
    FrontSide='FrontSide',
    BackSide='BackSide',
    DoubleSide='DoubleSide',
)

Shading = EnumNamespace(
    FlatShading='FlatShading',
    SmoothShading='SmoothShading',
)

Colors = EnumNamespace(
    NoColors='NoColors',
    FaceColors='FaceColors',
    VertexColors='VertexColors',
)

BlendingMode = EnumNamespace(
    NoBlending='NoBlending',
    NormalBlending='NormalBlending',
    AdditiveBlending='AdditiveBlending',
    SubtractiveBlending='SubtractiveBlending',
    MultiplyBlending='MultiplyBlending',
    CustomBlending='CustomBlending',
)

DepthMode = EnumNamespace(
    NeverDepth='NeverDepth',
    AlwaysDepth='AlwaysDepth',
    LessDepth='LessDepth',
    LessEqualDepth='LessEqualDepth',
    EqualDepth='EqualDepth',
    GreaterEqualDepth='GreaterEqualDepth',
    GreaterDepth='GreaterDepth',
    NotEqualDepth='NotEqualDepth',
)

Operations = EnumNamespace(
    MultiplyOperation='MultiplyOperation',
    MixOperation='MixOperation',
    AddOperation='AddOperation',
)

MappingModes = EnumNamespace(
    UVMapping='UVMapping',
    CubeReflectionMapping='CubeReflectionMapping',
    CubeRefractionMapping='CubeRefractionMapping',
    EquirectangularReflectionMapping='EquirectangularReflectionMapping',
    EquirectangularRefractionMapping='EquirectangularRefractionMapping',
    SphericalReflectionMapping='SphericalReflectionMapping',
    CubeUVReflectionMapping='CubeUVReflectionMapping',
    CubeUVRefractionMapping='CubeUVRefractionMapping',
)

WrappingModes = EnumNamespace(
    RepeatWrapping='RepeatWrapping',
    ClampToEdgeWrapping='ClampToEdgeWrapping',
    MirroredRepeatWrapping='MirroredRepeatWrapping',
)

Filters = EnumNamespace(
    NearestFilter='NearestFilter',
    NearestMipMapNearestFilter='NearestMipMapNearestFilter',
    NearestMipMapLinearFilter='NearestMipMapLinearFilter',
    LinearFilter='LinearFilter',
    LinearMipMapNearestFilter='LinearMipMapNearestFilter',
    LinearMipMapLinearFilter='LinearMipMapLinearFilter',
)

DataTypes = EnumNamespace(
    UnsignedByteType='UnsignedByteType',
    ByteType='ByteType',
    ShortType='ShortType',
    UnsignedShortType='UnsignedShortType',
    IntType='IntType',
    UnsignedIntType='UnsignedIntType',
    FloatType='FloatType',
    HalfFloatType='HalfFloatType',
)

PixelTypes = EnumNamespace(
    UnsignedShort4444Type='UnsignedShort4444Type',
    UnsignedShort5551Type='UnsignedShort5551Type',
    UnsignedShort565Type='UnsignedShort565Type',
    UnsignedInt248Type='UnsignedInt248Type',
)

PixelFormats = EnumNamespace(
    AlphaFormat='AlphaFormat',
    RGBFormat='RGBFormat',
    RGBAFormat='RGBAFormat',
    RGBEFormat='RGBEFormat',
    LuminanceFormat='LuminanceFormat',
    LuminanceAlphaFormat='LuminanceAlphaFormat',
    DepthFormat='DepthFormat',
    DepthStencilFormat='DepthStencilFormat',
    RedFormat='RedFormat',
)

DepthFormats = EnumNamespace(
    DepthFormat='DepthFormat',
    DepthStencilFormat='DepthStencilFormat',
)

CompressedTextureFormats = EnumNamespace(
    RGB_S3TC_DXT1_Format='RGB_S3TC_DXT1_Format',
    RGBA_S3TC_DXT1_Format='RGBA_S3TC_DXT1_Format',
    RGBA_S3TC_DXT3_Format='RGBA_S3TC_DXT3_Format',
    RGBA_S3TC_DXT5_Format='RGBA_S3TC_DXT5_Format',
    RGB_PVRTC_4BPPV1_Format='RGB_PVRTC_4BPPV1_Format',
    RGB_PVRTC_2BPPV1_Format='RGB_PVRTC_2BPPV1_Format',
    RGBA_PVRTC_4BPPV1_Format='RGBA_PVRTC_4BPPV1_Format',
    RGBA_PVRTC_2BPPV1_Format='RGBA_PVRTC_2BPPV1_Format',
    RGB_ETC1_Format='RGB_ETC1_Format',
    RGBA_ASTC_4x4_Format='RGBA_ASTC_4x4_Format',
    RGBA_ASTC_5x4_Format='RGBA_ASTC_5x4_Format',
    RGBA_ASTC_5x5_Format='RGBA_ASTC_5x5_Format',
    RGBA_ASTC_6x5_Format='RGBA_ASTC_6x5_Format',
    RGBA_ASTC_6x6_Format='RGBA_ASTC_6x6_Format',
    RGBA_ASTC_8x5_Format='RGBA_ASTC_8x5_Format',
    RGBA_ASTC_8x6_Format='RGBA_ASTC_8x6_Format',
    RGBA_ASTC_8x8_Format='RGBA_ASTC_8x8_Format',
    RGBA_ASTC_10x5_Format='RGBA_ASTC_10x5_Format',
    RGBA_ASTC_10x6_Format='RGBA_ASTC_10x6_Format',
    RGBA_ASTC_10x8_Format='RGBA_ASTC_10x8_Format',
    RGBA_ASTC_10x10_Format='RGBA_ASTC_10x10_Format',
    RGBA_ASTC_12x10_Format='RGBA_ASTC_12x10_Format',
    RGBA_ASTC_12x12_Format='RGBA_ASTC_12x12_Format',
)

TextureEncodings = EnumNamespace(
    LinearEncoding='LinearEncoding',
    sRGBEncoding='sRGBEncoding',
    RGBEEncoding='RGBEEncoding',
    LogLuvEncoding='LogLuvEncoding',
    RGBM7Encoding='RGBM7Encoding',
    RGBM16Encoding='RGBM16Encoding',
    RGBDEncoding='RGBDEncoding',
    GammaEncoding='GammaEncoding',
    BasicDepthPacking='BasicDepthPacking',
    RGBADepthPacking='RGBADepthPacking',
)

CullFaceModes = EnumNamespace(
    CullFaceNone='CullFaceNone',
    CullFaceBack='CullFaceBack',
    CullFaceFront='CullFaceFront',
    CullFaceFrontBack='CullFaceFrontBack',
)

FrontFaceDirection = EnumNamespace(
    FrontFaceDirectionCW='FrontFaceDirectionCW',
    FrontFaceDirectionCCW='FrontFaceDirectionCCW',
)

ShadowTypes = EnumNamespace(
    BasicShadowMap='BasicShadowMap',
    PCFShadowMap='PCFShadowMap',
    PCFSoftShadowMap='PCFSoftShadowMap',
)

ToneMappings = EnumNamespace(
    NoToneMapping='NoToneMapping',
    LinearToneMapping='LinearToneMapping',
    ReinhardToneMapping='ReinhardToneMapping',
    Uncharted2ToneMapping='Uncharted2ToneMapping',
    CineonToneMapping='CineonToneMapping',
)

LoopModes = EnumNamespace(
    LoopOnce='LoopOnce',
    LoopRepeat='LoopRepeat',
    LoopPingPong='LoopPingPong',
)

InterpolationModes = EnumNamespace(
    InterpolateDiscrete='InterpolateDiscrete',
    InterpolateLinear='InterpolateLinear',
    InterpolateSmooth='InterpolateSmooth',
)

EndingModes = EnumNamespace(
    ZeroCurvatureEnding='ZeroCurvatureEnding',
    ZeroSlopeEnding='ZeroSlopeEnding',
    WrapAroundEnding='WrapAroundEnding',
)

DrawModes = EnumNamespace(
    TrianglesDrawMode='TrianglesDrawMode',
    TriangleStripDrawMode='TriangleStripDrawMode',
    TriangleFanDrawMode='TriangleFanDrawMode',
)
