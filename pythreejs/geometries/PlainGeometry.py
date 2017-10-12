from ipywidgets import register
from .PlainGeometry_autogen import PlainGeometry as PlainGeometryBase


@register
class PlainGeometry(PlainGeometryBase):

    @classmethod
    def from_geometry(cls, geometry):
        """Creates a PlainGeometry of another geometry.

        NOTE:
        The PlainGeometry will copy the arrays from the source geometry.
        To avoid this, use PlainBufferGeometry.
        """
        return cls(_ref_geometry=geometry)



