import numpy as np
from traitlets import validate, TraitError

from .DataTexture_autogen import DataTexture as BaseDataTexture


class DataTexture(BaseDataTexture):

    @validate('data')
    def _valid_data(self, proposal):
        # Validate shape
        if np.ndim(proposal) > 2:
            raise TraitError('Data needs to have two or three dimensions. Given shape was: %r'
                % np.shape(proposal))
        old = self._trait_values.get(proposal['trait'].name, None)
        value = proposal['value']
        if old is not None and np.shape(old) != np.shape(value):
            raise TraitError('Cannot change shape of previously initialized DataTexture.')
        if value.dtype == np.float64:
            # 64-bit not supported, coerce to 32-bit
            value = value.astype(np.float32)
        return value
