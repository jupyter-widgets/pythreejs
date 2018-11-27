import numpy as np
from ipywidgets import register
from traitlets import validate, TraitError, Undefined
from ipydatawidgets import NDArrayWidget

from .DataTexture3D_autogen import DataTexture3D as BaseDataTexture3D


@register
class DataTexture3D(BaseDataTexture3D):

    @validate('data')
    def _valid_data(self, proposal):
        value = proposal['value']
        array = value.array if isinstance(value, NDArrayWidget) else value

        # Validate shape
        if np.ndim(array) < 3 or np.ndim(array) > 4:
            raise TraitError('Data needs to have three or four dimensions. Given shape was: %r'
                % (np.shape(array),))

        old = self._trait_values.get(proposal['trait'].name, None)
        if old is not None and np.ndim(old) > 0 and np.shape(old) != np.shape(array):
            raise TraitError('Cannot change shape of previously initialized DataTexture3D. %r vs %r'
                % (np.shape(old), np.shape(array)))

        return value
