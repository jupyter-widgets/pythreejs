import six
from ipywidgets import (
    Widget, DOMWidget, widget_serialization, register
)
from ipywidgets.widgets.trait_types import TypedTuple
from traitlets import (
    Unicode, Int, CInt, Instance, ForwardDeclaredInstance, This, Enum,
    Tuple, List, Dict, Float, CFloat, Bool, Union, Any,
)

from .._base.Three import ThreeWidget
from .._base.uniforms import uniforms_serialization
from ..enums import *
from ..traits import *

from ..materials.ShaderMaterial_autogen import ShaderMaterial
from .TrackballControls_autogen import TrackballControls as BaseTrackballControls

@register
class TrackballControls(BaseTrackballControls):
    def __init__(self, shaderMaterial=None, controlling=None, **kwargs):
        kwargs['shaderMaterial'] = shaderMaterial
        super(TrackballControls, self).__init__(controlling=controlling, **kwargs)

    shaderMaterial = Instance(ShaderMaterial, allow_none=True).tag(sync=True, **widget_serialization)

if six.PY3:
    import inspect
    # Include explicit signature since the metaclass screws it up
    TrackballControls.__signature__ = inspect.signature(TrackballControls.__init__)
