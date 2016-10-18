from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float,
                       CFloat, Bool)
from .._package import npm_pkg_name

class ThreeWidget(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)

    def __init__(self, **kwargs):
        Widget.__init__(self, **kwargs)
        self.on_msg(self.on_potential_ret_val)

    def exec_three_obj_method(self, method_name, *args, **kwargs):
        content = {
            "type": "exec_three_obj_method",
            "method_name": method_name,
            "args": args
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

    def on_potential_ret_val(self, widget, content, buffers):
        if content['type'] == "exec_three_obj_method_retval":
            self.on_ret_val(content['method_name'], content['ret_val'])

    def on_ret_val(self, method_name, ret_val):
        self.log('%s() -> %s' % (method_name, ret_val))

