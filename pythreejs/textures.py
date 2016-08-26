r"""
Three

In this wrapping of three.js, we try to stay close to the three.js API. Often,
the three.js documentation at http://threejs.org/docs/ helps in understanding
these classes and the various constants.

This is meant to be a low-level wrapper around three.js. We hope that others
will use this foundation to build higher-level interfaces to build 3d plots.

Another resource to understanding three.js decisions is the Udacity course on
3d graphics using three.js: https://www.udacity.com/course/cs291
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name


class Texture(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('TextureView').tag(sync=True)
    _model_name = Unicode('TextureModel').tag(sync=True)


class ImageTexture(Texture):
    """An image texture.

    The imageuri can be a data url or a web url.
    """
    _view_name = Unicode('ImageTextureView').tag(sync=True)
    _model_name = Unicode('ImageTextureModel').tag(sync=True)

    imageuri = Unicode().tag(sync=True)


class DataTexture(Texture):
    """A data-based texture.

    See http://threejs.org/docs/#Reference/Textures/DataTexture.
    """
    _view_name = Unicode('DataTextureView').tag(sync=True)
    _model_name = Unicode('DataTextureModel').tag(sync=True)

    data = List(CInt).tag(sync=True)
    format = Enum(['RGBAFormat', 'AlphaFormat', 'RGBFormat', 'LuminanceFormat',
                   'LuminanceAlphaFormat'], 'RGBAFormat').tag(sync=True)
    width = CInt(256).tag(sync=True)
    height = CInt(256).tag(sync=True)
    type = Enum(['UnsignedByteType', 'ByteType', 'ShortType',
                 'UnsignedShortType', 'IntType', 'UnsignedIntType',
                 'FloatType', 'UnsignedShort4444Type', 'UnsignedShort5551Type',
                 'UnsignedShort565Type'], 'UnsignedByteType').tag(sync=True)
    mapping = Enum(['UVMapping', 'CubeReflectionMapping',
                    'CubeRefractionMapping', 'SphericalReflectionMapping',
                    'SphericalRefractionMapping'], 'UVMapping').tag(sync=True)
    wrapS = Enum(['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping'],
                 'ClampToEdgeWrapping').tag(sync=True)
    wrapT = Enum(['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping'],
                 'ClampToEdgeWrapping').tag(sync=True)
    magFilter = Enum(['LinearFilter', 'NearestFilter'], 'LinearFilter').tag(sync=True)
    minFilter = Enum(['NearestFilter', 'NearestMipMapNearestFilter',
                      'NearestMipMapLinearFilter', 'LinearFilter',
                      'LinearMipMapNearestFilter'], 'NearestFilter').tag(sync=True)
    anisotropy = CInt(1).tag(sync=True)


class TextTexture(Texture):
    _view_name = Unicode('TextTextureView').tag(sync=True)
    _model_name = Unicode('TextTextureModel').tag(sync=True)

    fontFace = Unicode('Arial').tag(sync=True)
    size = CInt(12).tag(sync=True)
    color = Color('black').tag(sync=True)
    string = Unicode(sync=True)
    squareTexture = Bool(True).tag(sync=True)


