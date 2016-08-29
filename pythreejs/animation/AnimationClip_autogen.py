from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool

from .Animation import Animation

class AnimationClip(Animation):
    """AnimationClip
    
    See http://threejs.org/docs/#Reference/animation/AnimationClip.js
    """
    
    _view_name = Unicode('AnimationClipView').tag(sync=True)
    _model_name = Unicode('AnimationClipModel').tag(sync=True)
    
