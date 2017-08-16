
from ipywidgets import register
from .PlainBufferGeometry_autogen import PlainBufferGeometry as PlainBufferGeometryBase


@register
class PlainBufferGeometry(PlainBufferGeometryBase):

    @classmethod
    def from_geometry(cls, geometry):
        """Creates a PlainBufferGeometry of another geometry.
        """
        return cls(_ref_geometry=geometry)



