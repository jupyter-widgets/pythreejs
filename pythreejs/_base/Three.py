from ipywidgets import Widget, widget_serialization
from traitlets import Unicode

from .._package import npm_pkg_name
from .._version import EXTENSION_SPEC_VERSION


class ThreeWidget(Widget):
    """Base widget type for all pythreejs widgets"""

    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    _previewable = True

    def __init__(self, **kwargs):
        super(ThreeWidget, self).__init__(**kwargs)
        self.on_msg(self._on_potential_ret_val)

    def exec_three_obj_method(self, method_name, *args, **kwargs):
        """Execute a method on the three object.

        Excute the method specified by `method_name` on the three
        object, with arguments `args`. `kwargs` is currently ignored.
        """
        content = {
            "type": "exec_three_obj_method",
            "method_name": method_name,
            "args": widget_serialization['to_json'](args, None)
        }
        self.send(content=content, buffers=None)

    def _on_potential_ret_val(self, widget, content, buffers):
        """Message callback used internally"""
        if content['type'] == "exec_three_obj_method_retval":
            self._on_ret_val(content['method_name'], content['ret_val'])

    def _on_ret_val(self, method_name, ret_val):
        """Message callback used internally for logging exec returns"""
        self.log.info('%s() -> %s' % (method_name, ret_val))

    def _ipython_display_(self, **kwargs):
        if self._previewable:
            from IPython.display import display
            from .renderable import Preview
            return display(Preview(self), **kwargs)
        else:
            return super(ThreeWidget, self)._ipython_display_(**kwargs)
