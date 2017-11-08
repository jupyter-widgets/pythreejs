
from ipywidgets import register, widget_serialization
from traitlets import validate, TraitError
from ipydatawidgets import NDArrayWidget

from .BufferGeometry_autogen import BufferGeometry as BufferGeometryBase



@register
class BufferGeometry(BufferGeometryBase):

    @classmethod
    def from_geometry(cls, geometry):
        """Creates a PlainBufferGeometry of another geometry.
        """
        return cls(_ref_geometry=geometry)

    @validate('attributes')
    def validate(self, proposal):
        value = proposal['value']

        if 'index' in value:
            # We treat index special, so we might as well do some checking:
            idx = value['index'].array
            array = idx.array if isinstance(idx, NDArrayWidget) else idx
            if array.dtype.kind != 'u':
                raise TraitError('Index attribute must have unsigned integer data')
            if array.ndim != 1:
                raise TraitError('Index attribute must be a flat array. Consider using array.ravel().')

        return value
