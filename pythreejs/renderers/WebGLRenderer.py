from ipywidgets import widget_serialization
from traitlets import Unicode, CInt, link

from .._base.renderable import RenderableWidget

to_json = widget_serialization['to_json']
from_json = widget_serialization['from_json']


class WebGLRenderer(RenderableWidget):
    """WebGLRenderer

    See http://threejs.org/docs/#api/renderers/WebGLRenderer
    """

    _view_name = Unicode('WebGLRendererView').tag(sync=True)
    _model_name = Unicode('WebGLRendererModel').tag(sync=True)

    width = CInt(200)
    height = CInt(200)

    def __init__(self, antialias=False, alpha=False, **kwargs):
        super(WebGLRenderer, self).__init__(_antialias=antialias, _alpha=alpha, **kwargs)
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

