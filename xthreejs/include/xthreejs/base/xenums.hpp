#ifndef XTHREE_ENUMS_HPP
#define XTHREE_ENUMS_HPP

//
// This file auto-generated with generate-enums.js
// Date: Fri Feb 09 2018 12:06:09 GMT+0100 (CET)
//

#include "xwidgets/xeither.hpp"

namespace xthree{
    namespace xenums{

        auto Equations = XEITHER(
            "AddEquation",
            "SubtractEquation",
            "ReverseSubtractEquation",
            "MinEquation",
            "MaxEquation",
        );

        auto BlendFactors = XEITHER(
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
        );

        auto Side = XEITHER(
            "FrontSide",
            "BackSide",
            "DoubleSide",
        );

        auto Shading = XEITHER(
            "FlatShading",
            "SmoothShading",
        );

        auto Colors = XEITHER(
            "NoColors",
            "FaceColors",
            "VertexColors",
        );

        auto BlendingMode = XEITHER(
            "NoBlending",
            "NormalBlending",
            "AdditiveBlending",
            "SubtractiveBlending",
            "MultiplyBlending",
            "CustomBlending",
        );

        auto DepthMode = XEITHER(
            "NeverDepth",
            "AlwaysDepth",
            "LessDepth",
            "LessEqualDepth",
            "EqualDepth",
            "GreaterEqualDepth",
            "GreaterDepth",
            "NotEqualDepth",
        );

        auto Operations = XEITHER(
            "MultiplyOperation",
            "MixOperation",
            "AddOperation",
        );

        auto MappingModes = XEITHER(
            "UVMapping",
            "CubeReflectionMapping",
            "CubeRefractionMapping",
            "EquirectangularReflectionMapping",
            "EquirectangularRefractionMapping",
            "SphericalReflectionMapping",
            "CubeUVReflectionMapping",
            "CubeUVRefractionMapping",
        );

        auto WrappingModes = XEITHER(
            "RepeatWrapping",
            "ClampToEdgeWrapping",
            "MirroredRepeatWrapping",
        );

        auto Filters = XEITHER(
            "NearestFilter",
            "NearestMipMapNearestFilter",
            "NearestMipMapLinearFilter",
            "LinearFilter",
            "LinearMipMapNearestFilter",
            "LinearMipMapLinearFilter",
        );

        auto DataTypes = XEITHER(
            "UnsignedByteType",
            "ByteType",
            "ShortType",
            "UnsignedShortType",
            "IntType",
            "UnsignedIntType",
            "FloatType",
            "HalfFloatType",
        );

        auto PixelTypes = XEITHER(
            "UnsignedShort4444Type",
            "UnsignedShort5551Type",
            "UnsignedShort565Type",
            "UnsignedInt248Type",
        );

        auto PixelFormats = XEITHER(
            "AlphaFormat",
            "RGBFormat",
            "RGBAFormat",
            "LuminanceFormat",
            "LuminanceAlphaFormat",
            "DepthFormat",
            "DepthStencilFormat",
        );

        auto DepthFormats = XEITHER(
            "DepthFormat",
            "DepthStencilFormat",
        );

        auto CompressedTextureFormats = XEITHER(
            "RGB_S3TC_DXT1_Format",
            "RGBA_S3TC_DXT1_Format",
            "RGBA_S3TC_DXT3_Format",
            "RGBA_S3TC_DXT5_Format",
            "RGB_PVRTC_4BPPV1_Format",
            "RGB_PVRTC_2BPPV1_Format",
            "RGBA_PVRTC_4BPPV1_Format",
            "RGBA_PVRTC_2BPPV1_Format",
            "RGB_ETC1_Format",
        );

        auto TextureEncodings = XEITHER(
            "LinearEncoding",
            "sRGBEncoding",
            "RGBEEncoding",
            "LogLuvEncoding",
            "RGBM7Encoding",
            "RGBM16Encoding",
            "RGBDEncoding",
            "GammaEncoding",
        );

        auto CullFaceModes = XEITHER(
            "CullFaceNone",
            "CullFaceBack",
            "CullFaceFront",
            "CullFaceFrontBack",
        );

        auto FrontFaceDirection = XEITHER(
            "FrontFaceDirectionCW",
            "FrontFaceDirectionCCW",
        );

        auto ShadowTypes = XEITHER(
            "BasicShadowMap",
            "PCFShadowMap",
            "PCFSoftShadowMap",
        );

        auto ToneMappings = XEITHER(
            "NoToneMapping",
            "LinearToneMapping",
            "ReinhardToneMapping",
            "Uncharted2ToneMapping",
            "CineonToneMapping",
        );

        auto LoopModes = XEITHER(
            "LoopOnce",
            "LoopRepeat",
            "LoopPingPong",
        );

        auto InterpolationModes = XEITHER(
            "InterpolateDiscrete",
            "InterpolateLinear",
            "InterpolateSmooth",
        );

        auto EndingModes = XEITHER(
            "ZeroCurvatureEnding",
            "ZeroSlopeEnding",
            "WrapAroundEnding",
        );

        auto DrawModes = XEITHER(
            "TrianglesDrawMode",
            "TriangleStripDrawMode",
            "TriangleFanDrawMode",
        );
    }
}
#endif