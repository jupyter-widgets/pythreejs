import numpy as np
from ipywidgets import register
from traitlets import validate, TraitError, Undefined
from ipydatawidgets import NDArray, array_serialization, NDArrayWidget

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
        # Validate shape
        if np.ndim(proposal) > 2:
            raise TraitError('Array needs to have at most two dimensions. Given shape was: %r'
                % np.shape(proposal))
        value = proposal['value']
        if value is not Undefined and value.dtype == np.float64:
            # 64-bit not supported, coerce to 32-bit
            value = value.astype(np.float32)
        return value
