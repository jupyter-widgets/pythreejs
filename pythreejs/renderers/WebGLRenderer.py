from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import Unicode, Int, CInt, Instance, This, Enum, List, Dict, Float, CFloat, Bool

from ..enums import *
from ..traits import *

from .._base.Three import ThreeWidget
from ..math.Plane_autogen import Plane

class WebGLRenderer(ThreeWidget):
    """WebGLRenderer
    
    Author: @abelnation
    Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
    See http://threejs.org/docs/#Reference/Renderers/WebGLRenderer
    """
    
    _view_name = Unicode('WebGLRendererView').tag(sync=True)
    _model_name = Unicode('WebGLRendererModel').tag(sync=True)

    width = CInt(200).tag(sync=True)
    height = CInt(200).tag(sync=True)
    autoClear = Bool(True).tag(sync=True)
    autoClearColor = Bool(True).tag(sync=True)
    clearColor = Unicode('#000000').tag(sync=True)
    clearOpacity = CFloat(1.0).tag(sync=True)
    autoClearDepth = Bool(True).tag(sync=True)
    autoClearStencil = Bool(True).tag(sync=True)
    sortObject = Bool(True).tag(sync=True)
    clippingPlanes = List(Instance(Plane)).tag(sync=True, **widget_serialization)
    localClippingEnabled = Bool(False).tag(sync=True)
    gammaFactor = CFloat(2.0).tag(sync=True)
    gammaInput = Bool(False).tag(sync=True)
    gammaOutput = Bool(False).tag(sync=True)
    physicallyCorrectLights = Bool(False).tag(sync=True)
    # TODO: 
    # toneMapping = Enum(ToneMapping, "LinearToneMapping").tag(sync=True)
    toneMappingExposure = CFloat(1.0).tag(sync=True)
    toneMappingWhitePoint = CFloat(1.0).tag(sync=True)
    maxMorphTargets = CInt(8).tag(sync=True)
    maxMorphNormals = CInt(4).tag(sync=True)





