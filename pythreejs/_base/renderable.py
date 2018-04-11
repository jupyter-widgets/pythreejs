from ipywidgets import DOMWidget, Widget, widget_serialization
from traitlets import Unicode, CInt, CFloat, Enum, Bool, Instance, List

from .._package import npm_pkg_name
from .._version import EXTENSION_SPEC_VERSION

from .Three import ThreeWidget
from ..enums import ToneMappings
from ..math.Plane_autogen import Plane
from ..renderers.webgl.WebGLShadowMap_autogen import WebGLShadowMap


class RenderableWidget(DOMWidget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    # renderer properties
    _width = CInt(200).tag(sync=True)
    _height = CInt(200).tag(sync=True)
    _antialias = Bool(False).tag(sync=True)
    _alpha = Bool(False).tag(sync=True)

    autoClear = Bool(True).tag(sync=True)
    autoClearColor = Bool(True).tag(sync=True)
    autoClearDepth = Bool(True).tag(sync=True)
    autoClearStencil = Bool(True).tag(sync=True)
    clippingPlanes = List(Instance(Plane)).tag(sync=True, **widget_serialization)
    gammaFactor = CFloat(2.0).tag(sync=True)
    gammaInput = Bool(False).tag(sync=True)
    gammaOutput = Bool(False).tag(sync=True)
    localClippingEnabled = Bool(False).tag(sync=True)
    maxMorphTargets = CInt(8).tag(sync=True)
    maxMorphNormals = CInt(4).tag(sync=True)
    physicallyCorrectLights = Bool(False).tag(sync=True)
    shadowMap = Instance(WebGLShadowMap, args=(), allow_none=True).tag(sync=True, **widget_serialization)
    sortObject = Bool(True).tag(sync=True)
    toneMapping = Enum(ToneMappings, 'LinearToneMapping').tag(sync=True)
    toneMappingExposure = CFloat(1.0).tag(sync=True)
    toneMappingWhitePoint = CFloat(1.0).tag(sync=True)

    clearColor = Unicode('#000000').tag(sync=True)
    clearOpacity = CFloat(1.0).tag(sync=True)

    def send_msg(self, message_type, payload=None):
        if payload is None:
            payload = {}
        content = {
            "type": message_type,
            "payload": payload
        }
        self.send(content=content, buffers=None)

    def log(self, msg):
        content = {
            'type': 'print',
            'msg': msg
        }
        self.send(content=content, buffers=None)

    def freeze(self):
        content = {
            "type": "freeze"
        }
        self.send(content)


class Preview(RenderableWidget):
    # renderer properties
    _flat = Bool(False).tag(sync=True)
    _wire = Bool(False).tag(sync=True)
    _model_name = Unicode('PreviewModel').tag(sync=True)
    _view_name = Unicode('PreviewView').tag(sync=True)

    child = Instance(ThreeWidget).tag(sync=True, **widget_serialization)

    def __init__(self, child, **kwargs):
        super(Preview, self).__init__(child=child, **kwargs)
