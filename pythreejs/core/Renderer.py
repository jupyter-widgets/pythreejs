"""
"""

import six
from ipywidgets import widget_serialization
from traitlets import (
    Unicode, CInt, Instance, Float, Tuple, Undefined, link)

from ..traits import *

from .._base.renderable import RenderableWidget
from ..scenes.Scene_autogen import Scene
from ..cameras.Camera_autogen import Camera
from ..controls.Controls_autogen import Controls

to_json = widget_serialization['to_json']
from_json = widget_serialization['from_json']

class Renderer(RenderableWidget):
    """Renderer
    """

    _view_name = Unicode('RendererView').tag(sync=True)
    _model_name = Unicode('RendererModel').tag(sync=True)

    width = CInt(200)
    height = CInt(200)
    scene = Instance(Scene).tag(sync=True, **widget_serialization)
    camera = Instance(Camera).tag(sync=True, **widget_serialization)
    controls = List(Instance(Controls)).tag(sync=True, **widget_serialization)
    #effect = Instance(Effect, allow_none=True).tag(sync=True, **widget_serialization)
    background = Color('black', allow_none=True).tag(sync=True)
    background_opacity = Float(1.0, min=0.0, max=1.0).tag(sync=True)

    def __init__(self, scene, camera, controls=None, antialias=False, alpha=False, **kwargs):
        super(Renderer, self).__init__(
            scene=scene,
            camera=camera,
            controls=controls or [],
            _antialias=antialias,
            _alpha=alpha,
            **kwargs)
        link((self, 'width'), (self, '_width'))
        link((self, 'height'), (self, '_height'))

    def render(self, scene, camera):
        content = {
            "type": "render",
            "scene": to_json(scene, None),
            "camera": to_json(camera, None)
        }
        self.send(content)

    def freeze(self):
        content = {
            "type": "freeze"
        }
        self.send(content)


if six.PY3:
    from inspect import Signature, Parameter
    # Include explicit signature since the metaclass screws it up
    parameters = [
        Parameter('scene', Parameter.POSITIONAL_OR_KEYWORD),
        Parameter('camera', Parameter.POSITIONAL_OR_KEYWORD),
        Parameter('controls', Parameter.POSITIONAL_OR_KEYWORD, default=None),
    ]
    for name in ('width', 'height', 'background', 'background_opacity'):
        parameters.append(Parameter(
            name, Parameter.KEYWORD_ONLY, default=getattr(Renderer, name).default_value))
    parameters.append(Parameter('kwargs', Parameter.VAR_KEYWORD))
    Renderer.__signature__ = Signature(parameters=tuple(parameters))
    del parameters
