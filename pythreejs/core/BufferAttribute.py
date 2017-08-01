import numpy as np
from traitlets import validate, TraitError

from .BufferAttribute_autogen import BufferAttribute as BaseBufferAttribute


class BufferAttribute(BaseBufferAttribute):

    @validate('array')
    def _valid_array(self, proposal):
        # Validate shape
        if np.ndim(proposal) > 2:
            raise TraitError('Array needs to have at most two dimensions. Given shape was: %r'
                % np.shape(proposal))
        value = proposal['value']
        if value.dtype == np.float64:
            # 64-bit not supported, coerce to 32-bit
            value = value.astype(np.float32)
        return value
