from ipywidgets import Widget, widget_serialization
from traitlets import Unicode

from .._package import npm_pkg_name
from .._version import EXTENSION_VERSION


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
            "args": widget_serialization['to_json'](args, None)
        }
        self.send(content=content, buffers=None)

    def on_potential_ret_val(self, widget, content, buffers):
        if content['type'] == "exec_three_obj_method_retval":
            self.on_ret_val(content['method_name'], content['ret_val'])

    def on_ret_val(self, method_name, ret_val):
        self.log.info('%s() -> %s' % (method_name, ret_val))

    def _ipython_display_(self, **kwargs):
        from IPython.display import display
        from .renderable import Preview
        return display(Preview(self), **kwargs)
