import numpy as np
from ipywidgets import register
from traitlets import validate, TraitError, Undefined
from ipydatawidgets import NDArrayWidget

from .BufferAttribute_autogen import BufferAttribute as BaseBufferAttribute


@register
class BufferAttribute(BaseBufferAttribute):

    def __init__(self, array=None, normalized=True, **kwargs):
        if array is not None:
            # If not supplied, leave as undefined.
            # This is needed for remote initialization
            kwargs['array'] = array
        kwargs['normalized'] = normalized
        # NOTE: skip init of direct parent class on purpose:
        super(BaseBufferAttribute, self).__init__(**kwargs)

    @validate('array')
    def _valid_array(self, proposal):
        value = proposal['value']
        if isinstance(value, NDArrayWidget):
            value = value.array

        if isinstance(proposal['value'], NDArrayWidget):
            if value is not Undefined and value.dtype == np.float64:
                raise TraitError('Cannot use a float64 data widget as a BufferAttribute source.')
            return proposal['value']
        if value is not Undefined and value.dtype == np.float64:
            # 64-bit not supported, coerce to 32-bit
            value = value.astype(np.float32)
        return value
