r"""
ipywidget wrappers for three.js "Scenes" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .core import Object3d


class Scene(Object3d):
    _view_name = Unicode('SceneView').tag(sync=True)
    _model_name = Unicode('SceneModel').tag(sync=True)

