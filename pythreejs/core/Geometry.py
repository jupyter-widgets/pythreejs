from ipywidgets import register
from .Geometry_autogen import Geometry as GeometryBase


@register
class Geometry(GeometryBase):

    @classmethod
    def from_geometry(cls, geometry):
        """Creates a PlainGeometry of another geometry.

        NOTE:
        The PlainGeometry will copy the arrays from the source geometry.
        To avoid this, use PlainBufferGeometry.
        """
        return cls(_ref_geometry=geometry)



