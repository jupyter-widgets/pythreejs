import numpy as np
from ipywidgets import register
from traitlets import validate, TraitError, Undefined
from ipydatawidgets import NDArrayWidget

from .DataTexture_autogen import DataTexture as BaseDataTexture


@register
class DataTexture(BaseDataTexture):

    @validate('data')
    def _valid_data(self, proposal):
        value = proposal['value']
        if isinstance(value, NDArrayWidget):
            value = value.array

        # Validate shape
        if np.ndim(value) < 2 or np.ndim(value) > 3:
            raise TraitError('Data needs to have two or three dimensions. Given shape was: %r'
                % (np.shape(value),))

        old = self._trait_values.get(proposal['trait'].name, None)
        if old is not None and np.ndim(old) > 0 and np.shape(old) != np.shape(value):
            raise TraitError('Cannot change shape of previously initialized DataTexture. %r vs %r'
                % (np.shape(old), np.shape(value)))

        if isinstance(proposal['value'], NDArrayWidget):
            if value is not Undefined and value.dtype == np.float64:
                raise TraitError('Cannot use a float64 data widget as a BufferAttribute source.')
            return proposal['value']
        if value is not Undefined and value.dtype == np.float64:
            # 64-bit not supported, coerce to 32-bit
            value = value.astype(np.float32)
        return value

