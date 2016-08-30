r"""
ipywidget wrappers for three.js "Cameras" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .core import Object3d


class Camera(Object3d):
    _view_name = Unicode('CameraView').tag(sync=True)
    _model_name = Unicode('CameraModel').tag(sync=True)


class PerspectiveCamera(Camera):
    _view_name = Unicode('PerspectiveCameraView').tag(sync=True)
    _model_name = Unicode('PerspectiveCameraModel').tag(sync=True)

    fov = CFloat(50.0).tag(sync=True)
    aspect = CFloat(6.0 / 4.0).tag(sync=True)
    near = CFloat(0.1).tag(sync=True)
    far = CFloat(2000.0).tag(sync=True)


class OrthographicCamera(Camera):
    _view_name = Unicode('OrthographicCameraView').tag(sync=True)
    _model_name = Unicode('OrthographicCameraModel').tag(sync=True)

    left = CFloat(-10.0).tag(sync=True)
    right = CFloat(10.0).tag(sync=True)
    top = CFloat(-10.0).tag(sync=True)
    bottom = CFloat(10.0).tag(sync=True)
    near = CFloat(0.1).tag(sync=True)
    far = CFloat(2000.0).tag(sync=True)


