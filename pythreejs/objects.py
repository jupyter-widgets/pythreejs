r"""
ipywidget wrappers for three.js "Objects" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .core import Object3d, Geometry, SurfaceGeometry, FaceGeometry
from .materials import Material, _LineMaterial, LambertMaterial
from .extras import BoxGeometry, SphereGeometry


class Sprite(Object3d):
    _view_name = Unicode('SpriteView').tag(sync=True)
    _model_name = Unicode('SpriteModel').tag(sync=True)

    material = Instance(Material, allow_none=True).tag(sync=True, **widget_serialization)
    scaleToTexture = Bool().tag(sync=True)


class Mesh(Object3d):
    _view_name = Unicode('MeshView').tag(sync=True)
    _model_name = Unicode('MeshModel').tag(sync=True)

    geometry = Instance(Geometry).tag(sync=True, **widget_serialization)
    material = Instance(Material).tag(sync=True, **widget_serialization)


class Line(Mesh):
    _view_name = Unicode('LineView').tag(sync=True)
    _model_name = Unicode('LineModel').tag(sync=True)

    # TODO: these enums are in Three.Legacy.js.  Should they be removed?
    type = Enum(['LineStrip', 'LinePieces'], 'LineStrip').tag(sync=True)
    material = Instance(_LineMaterial).tag(sync=True, **widget_serialization)


class SurfaceGrid(Mesh):
    """A grid covering a surface.

    This will draw a line mesh overlaying the SurfaceGeometry.
    """
    _view_name = Unicode('SurfaceGridView').tag(sync=True)
    _model_name = Unicode('SurfaceGridModel').tag(sync=True)

    geometry = Instance(SurfaceGeometry).tag(sync=True, **widget_serialization)
    material = Instance(_LineMaterial).tag(sync=True, **widget_serialization)


class PlotMesh(Mesh):
    plot = Instance('sage.plot.plot3d.base.Graphics3d')

    def _plot_changed(self, name, old, new):
        self.type = new.scenetree_json()['type']
        if (self.type == 'object'):
            self.type = new.scenetree_json()['geometry']['type']
            self.material = self.material_from_object(new)
        else:
            self.type = new.scenetree_json()['children'][0]['geometry']['type']
            self.material = self.material_from_other(new)
        if(self.type == 'index_face_set'):
            self.geometry = self.geometry_from_plot(new)
        elif(self.type == 'sphere'):
            self.geometry = self.geometry_from_sphere(new)
        elif(self.type == 'box'):
            self.geometry = self.geometry_from_box(new)

    def material_from_object(self, p):
        # TODO: do this without scenetree_json()
        t = p.texture.scenetree_json()
        m = LambertMaterial(side='DoubleSide')
        m.color = t['color']
        m.opacity = t['opacity']
        # TODO: support other attributes
        return m

    def material_from_other(self, p):
        # TODO: do this without scenetree_json()
        t = p.scenetree_json()['children'][0]['texture']
        m = LambertMaterial(side='DoubleSide')
        m.color = t['color']
        m.opacity = t['opacity']
        # TODO: support other attributes
        return m

    def geometry_from_box(self, p):
        g = BoxGeometry()
        g.width = p.scenetree_json()['geometry']['size'][0]
        g.height = p.scenetree_json()['geometry']['size'][1]
        g.depth = p.scenetree_json()['geometry']['size'][2]
        return g

    def geometry_from_sphere(self, p):
        g = SphereGeometry()
        g.radius = p.scenetree_json()['children'][0]['geometry']['radius']
        return g

    def geometry_from_plot(self, p):
        from itertools import groupby, chain
        def flatten(ll):
            return list(chain.from_iterable(ll))
        p.triangulate()

        g = FaceGeometry()
        g.vertices = flatten(p.vertices())
        f = p.index_faces()
        f.sort(key=len)
        faces = { k:flatten(v) for k, v in groupby(f, len) }
        g.face3 = faces.get(3,[])
        g.face4 = faces.get(4,[])
        return g

