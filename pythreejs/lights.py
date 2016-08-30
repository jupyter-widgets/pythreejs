r"""
ipywidget wrappers for three.js "Lights" classes 
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .core import Object3d


class Light(Object3d):
    color = Color('white').tag(sync=True)  # could be string or number or tuple


class AmbientLight(Light):
    _view_name = Unicode('AmbientLight').tag(sync=True)
    _model_name = Unicode('AmbientLightModel').tag(sync=True)


class IntensityLight(Light):
    _view_name = Unicode('PositionLight').tag(sync=True)
    _model_name = Unicode('PositionLightModel').tag(sync=True)

    intensity = CFloat(1).tag(sync=True)


class HemisphereLight(IntensityLight):
    _view_name = Unicode('HemisphereLight').tag(sync=True)
    _model_name = Unicode('HemisphereLightModel').tag(sync=True)

    ground_color = Color('blue').tag(sync=True) # could be string, number, or RGB tuple


class DirectionalLight(IntensityLight):
    _view_name = Unicode('DirectionalLight').tag(sync=True)
    _model_name = Unicode('DirectionalLightModel').tag(sync=True)


class PointLight(IntensityLight):
    _view_name = Unicode('PointLight').tag(sync=True)
    _model_name = Unicode('PointLightModel').tag(sync=True)

    distance = CFloat(10).tag(sync=True)


class SpotLight(PointLight):
    _view_name = Unicode('SpotLight').tag(sync=True)
    _model_name = Unicode('SpotLightModel').tag(sync=True)

    angle = CFloat(10).tag(sync=True)
    exponent = CFloat(0.5).tag(sync=True)

