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

    if hasattr(Widget, "_ipython_display_"):  # ipywidgets < 8.0.0
        def _ipython_display_(self, **kwargs):
            if self._previewable:
                from IPython.display import display
                from .renderable import Preview
                return display(Preview(self), **kwargs)
            else:
                return super(ThreeWidget, self)._ipython_display_(**kwargs)
    else:
        def _repr_mimebundle_(self, **kwargs):
            if self._previewable:
                from .renderable import Preview
                plaintext = repr(self)
                if len(plaintext) > 110:
                    plaintext = plaintext[:110] + '…'
                preview = Preview(self)
                return {
                    'text/plain': plaintext,
                    'application/vnd.jupyter.widget-view+json': {
                        "version_major": 2,
                        "version_minor": 0,
                        "model_id": preview._model_id
                    }
                }
            else:
                return super(ThreeWidget, self)._repr_mimebundle_(**kwargs)