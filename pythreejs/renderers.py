r"""
ipywidget wrappers for three.js "Renderers" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .cameras import Camera
from .scenes import Scene
from .controls import Controls
from .effects import Effect

class Renderer(DOMWidget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('RendererView').tag(sync=True)
    _model_name = Unicode('RendererModel').tag(sync=True)

    width = Unicode('600').tag(sync=True)  # TODO: stop relying on deprecated DOMWidget attribute
    height = Unicode('400').tag(sync=True)
    renderer_type = Enum(['webgl', 'canvas', 'auto'], 'auto').tag(sync=True)
    scene = Instance(Scene).tag(sync=True, **widget_serialization)
    camera = Instance(Camera).tag(sync=True, **widget_serialization)
    controls = List(Instance(Controls)).tag(sync=True, **widget_serialization)
    effect = Instance(Effect, allow_none=True).tag(sync=True, **widget_serialization)
    background = Color('black', allow_none=True).tag(sync=True)
    backgroud_opacity = Float(min=0.0, max=1.0).tag(sync=True)

