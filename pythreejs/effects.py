r"""
ipywidget wrappers for three.js effects 
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name


class Effect(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)


class AnaglyphEffect(Effect):
    _view_name = Unicode('AnaglyphEffectView').tag(sync=True)
    _model_name = Unicode('AnaglyphEffectModel').tag(sync=True)

