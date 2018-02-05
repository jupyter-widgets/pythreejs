from ipywidgets import register
from .Geometry_autogen import Geometry as AutogenGeometry
from .._base.Three import ThreeWidget


@register
class Geometry(AutogenGeometry):

    @classmethod
    def from_geometry(cls, geometry, store_ref=False):
        """Creates a PlainGeometry of another geometry.

        store_ref determines if the reference is stored after initalization.
        If it is, it will be used for future embedding.

        NOTE:
        The PlainGeometry will copy the arrays from the source geometry.
        To avoid this, use PlainBufferGeometry.
        """
        return cls(_ref_geometry=geometry, _store_ref=store_ref)

    def _repr_keys(self):
        return filter(_make_key_filter(self._store_ref),
                      super(Geometry, self)._repr_keys())


_non_gen_keys = tuple(ThreeWidget.class_trait_names())

def _make_key_filter(use_ref):
    def key_filter(key):
        return (
            key in _non_gen_keys or
            (use_ref and key == '_ref_geometry') or
            (not use_ref and key != '_ref_geometry')
        )

            
