
from ipywidgets import register, widget_serialization
from traitlets import validate, TraitError, Undefined
from ipydatawidgets import NDArrayWidget, get_union_array

from .Geometry import _make_key_filter
from .BufferGeometry_autogen import BufferGeometry as BufferGeometryBase



@register
class BufferGeometry(BufferGeometryBase):

    @classmethod
    def from_geometry(cls, geometry, store_ref=False):
        """Creates a PlainBufferGeometry of another geometry.

        store_ref determines if the reference is stored after initalization.
        If it is, it will be used for future embedding.
        """
        return cls(_ref_geometry=geometry, _store_ref=store_ref)

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


    def _gen_repr_from_keys(self, keys):
        # Hide data in repr to avoid overly large datasets
        # Replace with uuids of buffer attributes
        data_keys = ('attributes', 'morphAttributes', 'index')
        class_name = self.__class__.__name__
        signature_parts = [
            '%s=%r' % (key, getattr(self, key))
            for key in keys if key not in data_keys
        ]
        if (not self._compare(self.index, self.__class__.index.default_value) and
                self.index is not None):
            signature_parts.append('index=%s' % _attr_value_repr(self.index))
        for name in ('attributes', 'morphAttributes'):
            if not _dict_is_default(self, name):
                signature_parts.append('%s=%s' % (name, _attr_dict_repr(getattr(self, name))))
        return '%s(%s)' % (class_name, ', '.join(signature_parts))

    def _repr_keys(self):
        return filter(_make_key_filter(self._store_ref),
                      super(BufferGeometry, self)._repr_keys())


def _dict_is_default(ht, name):
    value = getattr(ht, name)
    return (
        getattr(ht.__class__, name).default_value == Undefined and
        (value is None or len(value) == 0)
    )

def _attr_value_repr(v):
    try:
        array = get_union_array(v.array)
    except AttributeError:
        from .InterleavedBufferAttribute_autogen import InterleavedBufferAttribute
        if not isinstance(v, InterleavedBufferAttribute):
            raise
        return repr(v)
    # Return full repr if array size is small:
    if array.size < 50:
        return repr(v)
    # Otherwise, return a summary:
    return '<%s shape=%r, dtype=%s>' % (v.__class__.__name__, array.shape, array.dtype)

def _attr_dict_repr(d):
    parts = []
    for key, value in d.items():
        if isinstance(value, tuple):
            value_parts = [_attr_value_repr(v) for v in value]
        else:
            value_parts = [_attr_value_repr(value)]
        parts.append('%r: %s' % (key, ', '.join(value_parts)))
    return '{%s}' % (', '.join(parts),)
