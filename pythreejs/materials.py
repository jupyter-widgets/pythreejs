r"""
ipywidget wrappers for three.js "Materials" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .textures import Texture

class Material(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('MaterialView').tag(sync=True)
    _model_name = Unicode('MaterialModel').tag(sync=True)

    # id = TODO
    name = Unicode(sync=True)
    side = Enum(['FrontSide', 'BackSide', 'DoubleSide'], 'DoubleSide').tag(sync=True)
    opacity = CFloat(1.0).tag(sync=True)
    transparent = Bool().tag(sync=True)
    blending = Enum(['NoBlending', 'NormalBlending', 'AdditiveBlending',
                     'SubtractiveBlending', 'MultiplyBlending',
                     'CustomBlending'], 'NormalBlending').tag(sync=True)
    blendSrc = Enum(['ZeroFactor', 'OneFactor', 'SrcColorFactor',
                     'OneMinusSrcColorFactor', 'SrcAlphaFactor',
                     'OneMinusSrcAlphaFactor', 'DstAlphaFactor',
                     'OneMinusDstAlphaFactor'], 'SrcAlphaFactor').tag(sync=True)
    blendDst = Enum(['DstColorFactor', 'OneMinusDstColorFactor',
                     'SrcAlphaSaturateFactor'], 'OneMinusDstColorFactor').tag(sync=True)
    blendEquation = Enum(['AddEquation', 'SubtractEquation',
                          'ReverseSubtractEquation'], 'AddEquation').tag(sync=True)
    depthTest = Bool(True).tag(sync=True)
    depthWrite = Bool(True).tag(sync=True)
    polygonOffset = Bool(True).tag(sync=True)
    polygonOffsetFactor = CFloat(1.0).tag(sync=True)
    polygonOffsetUnits = CFloat(1.0).tag(sync=True)
    alphaTest = CFloat(1.0).tag(sync=True)
    overdraw = CFloat(1.0).tag(sync=True)
    visible = Bool(True).tag(sync=True)
    needsUpdate = Bool(True).tag(sync=True)


class BasicMaterial(Material):
    _view_name = Unicode('BasicMaterialView').tag(sync=True)
    _model_name = Unicode('BasicMaterialModel').tag(sync=True)

    color = Color('white').tag(sync=True)
    wireframe = Bool().tag(sync=True)
    wireframeLinewidth = CFloat(1.0).tag(sync=True)
    wireframeLinecap = Unicode('round').tag(sync=True)
    wireframeLinejoin = Unicode('round').tag(sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading').tag(sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors').tag(sync=True)
    fog = Bool().tag(sync=True)
    map = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    lightMap = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    specularMap = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    envMap = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    skinning = Bool().tag(sync=True)
    morphTargets = Bool().tag(sync=True)


class LambertMaterial(BasicMaterial):
    _view_name = Unicode('LambertMaterialView').tag(sync=True)
    _model_name = Unicode('LambertMaterialModel').tag(sync=True)

    emissive = Color('black').tag(sync=True)
    reflectivity = CFloat(1.0).tag(sync=True)
    refractionRatio = CFloat(0.98).tag(sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'],
                   'MultiplyOperation').tag(sync=True)


class PhongMaterial(BasicMaterial):
    _view_name = Unicode('PhongMaterialView').tag(sync=True)
    _model_name = Unicode('PhongMaterialModel').tag(sync=True)

    emissive = Color('black').tag(sync=True)
    specular = Color('darkgray').tag(sync=True)
    shininess = CFloat(30).tag(sync=True)
    reflectivity = CFloat(1.0).tag(sync=True)
    refractionRatio = CFloat(0.98).tag(sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'],
                    'MultiplyOperation').tag(sync=True)


class DepthMaterial(Material):
    _view_name = Unicode('DepthMaterialView').tag(sync=True)
    _model_name = Unicode('DepthMaterialModel').tag(sync=True)

    wireframe = Bool().tag(sync=True)
    wireframeLinewidth = CFloat(1.0).tag(sync=True)


class _LineMaterial(Material):
    """Abstract base class for line materials"""
    pass


class LineBasicMaterial(_LineMaterial):
    _view_name = Unicode('LineBasicMaterialView').tag(sync=True)
    _model_name = Unicode('LineBasicMaterialModel').tag(sync=True)

    color = Color('white').tag(sync=True)
    linewidth = CFloat(1.0).tag(sync=True)
    linecap = Unicode('round').tag(sync=True)
    linejoin = Unicode('round').tag(sync=True)
    fog = Bool().tag(sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors').tag(sync=True)


class LineDashedMaterial(_LineMaterial):
    _view_name = Unicode('LineDashedMaterialView').tag(sync=True)
    _model_name = Unicode('LineDashedMaterialModel').tag(sync=True)

    color = Color('white').tag(sync=True)
    linewidth = CFloat(1.0).tag(sync=True)
    scale = CFloat(1.0).tag(sync=True)
    dashSize = CFloat(3.0).tag(sync=True)
    gapSize = CFloat(1.0).tag(sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors').tag(sync=True)
    fog = Bool().tag(sync=True)


class NormalMaterial(Material):
    _view_name = Unicode('NormalMaterialView').tag(sync=True)
    _model_name = Unicode('NormalMaterialModel').tag(sync=True)

    morphTargets = Bool().tag(sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading').tag(sync=True)
    wireframe = Bool().tag(sync=True)
    wireframeLinewidth = CFloat(1.0).tag(sync=True)


class ParticleSystemMaterial(Material):
    _view_name = Unicode('ParticleSystemMaterialView').tag(sync=True)
    _model_name = Unicode('ParticleSystemMaterialModel').tag(sync=True)

    color = Color('yellow').tag(sync=True)
    map = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    size = CFloat(1.0).tag(sync=True)
    sizeAttenuation = Bool().tag(sync=True)
    vertexColors = Bool().tag(sync=True)
    fog = Bool().tag(sync=True)


class ShaderMaterial(Material):
    _view_name = Unicode('ShaderMaterialView').tag(sync=True)
    _model_name = Unicode('ShaderMaterialModel').tag(sync=True)

    fragmentShader = Unicode('void main(){ }').tag(sync=True)
    vertexShader = Unicode('void main(){ }').tag(sync=True)
    morphTargets = Bool().tag(sync=True)
    lights = Bool().tag(sync=True)
    morphNormals = Bool().tag(sync=True)
    wireframe = Bool().tag(sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors').tag(sync=True)
    skinning = Bool().tag(sync=True)
    fog = Bool().tag(sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading').tag(sync=True)
    linewidth = CFloat(1.0).tag(sync=True)
    wireframeLinewidth = CFloat(1.0).tag(sync=True)


class SpriteMaterial(Material):
    _view_name = Unicode('SpriteMaterialView').tag(sync=True)
    _model_name = Unicode('SpriteMaterialModel').tag(sync=True)

    map = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    uvScale = List(CFloat).tag(sync=True)
    sizeAttenuation = Bool().tag(sync=True)
    color = Color('white').tag(sync=True)
    uvOffset = List(CFloat).tag(sync=True)
    fog = Bool().tag(sync=True)
    useScreenCoordinates = Bool().tag(sync=True)
    scaleByViewport = Bool().tag(sync=True)
    alignment = List(CFloat).tag(sync=True)


