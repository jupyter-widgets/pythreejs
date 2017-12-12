from ipywidgets import register

from .._base.Three import ThreeWidget
from .BufferAttribute_autogen import BufferAttribute as BaseBufferAttribute


@register
class BufferAttribute(BaseBufferAttribute):

    _previewable = False

    def __init__(self, array=None, normalized=True, **kwargs):
        if array is not None:
            # Only include array in kwargs if supplied
            # This is needed for remote initialization
            # (Undefined behaves differently)
            kwargs['array'] = array
        kwargs['normalized'] = normalized
        # NOTE: skip init of direct parent class on purpose:
        super(BaseBufferAttribute, self).__init__(**kwargs)
