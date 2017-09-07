from ipywidgets import DOMWidget, Widget, widget_serialization
from traitlets import Unicode, CInt, Bool, Instance

from .._package import npm_pkg_name
from .._version import EXTENSION_VERSION


class RenderableWidget(DOMWidget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_VERSION).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_VERSION).tag(sync=True)

    # renderer properties
    _width = CInt(200).tag(sync=True)
    _height = CInt(200).tag(sync=True)

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


class ThreeWidget(Widget):
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_VERSION).tag(sync=True)

    def __init__(self, **kwargs):
        super(ThreeWidget, self).__init__(**kwargs)
        self.on_msg(self.on_potential_ret_val)

    def exec_three_obj_method(self, method_name, *args, **kwargs):
        content = {
            "type": "exec_three_obj_method",
            "method_name": method_name,
            "args": args
        }
        self.send(content=content, buffers=None)

    def on_potential_ret_val(self, widget, content, buffers):
        if content['type'] == "exec_three_obj_method_retval":
            self.on_ret_val(content['method_name'], content['ret_val'])

    def on_ret_val(self, method_name, ret_val):
        self.log.info('%s() -> %s' % (method_name, ret_val))

    def _ipython_display_(self, **kwargs):
        from IPython.display import display
        return display(PreviewWidget(self), **kwargs)


class PreviewWidget(RenderableWidget):
    # renderer properties
    _flat = Bool(False).tag(sync=True)
    _wire = Bool(False).tag(sync=True)
    _model_name = Unicode('PreviewModel').tag(sync=True)
    _view_name = Unicode('PreviewView').tag(sync=True)

    child = Instance(ThreeWidget).tag(sync=True, **widget_serialization)

    def __init__(self, child, **kwargs):
        super(PreviewWidget, self).__init__(child=child, **kwargs)
