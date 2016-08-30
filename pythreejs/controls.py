r"""
ipywidget wrapper for three.js control classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .core import Object3d
from .traits import vector2, vector3


class Controls(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('ControlsView').tag(sync=True)
    _model_name = Unicode('ControlsModel').tag(sync=True)

    controlling = Instance(Object3d, allow_none=True).tag(sync=True, **widget_serialization)


class OrbitControls(Controls):
    _view_name = Unicode('OrbitControlsView').tag(sync=True)
    _model_name = Unicode('OrbitControlsModel').tag(sync=True)

    target = vector3(CFloat).tag(sync=True)


class TrackballControls(Controls):
    _view_name = Unicode('TrackballControlsView').tag(sync=True)
    _model_name = Unicode('TrackballControlsModel').tag(sync=True)

    target = vector3(CFloat).tag(sync=True)


class FlyControls(Controls):
    _view_name = Unicode('FlyControlsView').tag(sync=True)
    _model_name = Unicode('FlyControlsModel').tag(sync=True)

    forward_speed = Float().tag(sync=True)
    lateral_speed = Float().tag(sync=True)
    upward_speed = Float().tag(sync=True)
    roll = Float().tag(sync=True)
    pitch = Float().tag(sync=True)
    yaw = Float().tag(sync=True)


class Picker(Controls):
    _view_name = Unicode('PickerView').tag(sync=True)
    _model_name = Unicode('PickerModel').tag(sync=True)

    event = Unicode('click').tag(sync=True)
    root = Instance(Object3d, allow_none=True).tag(sync=True, **widget_serialization)
    picked = List(Dict).tag(sync=True)
    distance = CFloat().tag(sync=True)
    point = vector3(CFloat).tag(sync=True)
    object = Instance(Object3d, allow_none=True).tag(sync=True, **widget_serialization)
    face = vector3(CInt).tag(sync=True)
    faceNormal = vector3(CFloat).tag(sync=True)
    faceVertices = List(vector3()).tag(sync=True)
    faceIndex = CInt().tag(sync=True)
    all = Bool().tag(sync=True)


