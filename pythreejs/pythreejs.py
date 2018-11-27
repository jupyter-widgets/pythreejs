r"""
Python widgets for three.js plotting

In this wrapping of three.js, we try to stay close to the three.js API. Often,
the three.js documentation at http://threejs.org/docs/ helps in understanding
these classes and the various constants.

This is meant to be a low-level wrapper around three.js. We hope that others
will use this foundation to build higher-level interfaces to build 3d plots.
"""

from __future__ import absolute_import

from ipywidgets import Widget, widget_serialization
from traitlets import Unicode, CInt, Instance, List, CFloat, Bool, observe, validate
import numpy as np

from ._package import npm_pkg_name
from ._version import EXTENSION_SPEC_VERSION


from .core.BufferAttribute import BufferAttribute
from .core.Geometry import Geometry
from .core.BufferGeometry import BufferGeometry
from .geometries.BoxGeometry_autogen import BoxGeometry
from .geometries.SphereGeometry_autogen import SphereGeometry
from .lights.AmbientLight_autogen import AmbientLight
from .lights.DirectionalLight_autogen import DirectionalLight
from .materials.Material_autogen import Material
from .materials.MeshLambertMaterial_autogen import MeshLambertMaterial
from .materials.SpriteMaterial_autogen import SpriteMaterial
from .objects.Group_autogen import Group
from .objects.Line_autogen import Line
from .objects.Mesh_autogen import Mesh
from .objects.Sprite_autogen import Sprite
from .textures.Texture_autogen import Texture
from .textures.DataTexture import DataTexture
from .textures.TextTexture_autogen import TextTexture



def grid_indices_gen(nx, ny):
    """A generator for grid vertex indices.
    """
    for x in range(nx - 1):
        for y in range(ny - 1):
            root = x + y * ny
            yield (root, root + 1, root + nx)
            yield (root + nx, root + 1, root + nx + 1)


class SurfaceGeometry(BufferGeometry):
    """
    A regular grid with heights
    """
    z = List(CFloat, [0] * 100)
    width = CInt(10)
    height = CInt(10)
    width_segments = CInt(10, read_only=True)
    height_segments = CInt(10, read_only=True)

    def __init__(self, **kwargs):
        for key in ['width_segments', 'height_segments']:
            if key in kwargs:
                self.set_trait(key, kwargs.pop(key))
        super(SurfaceGeometry, self).__init__(**kwargs)
        self._update_surface()

    @observe('z', 'width', 'height')
    def _on_change(self, change):
        # Only trigger automatically after initial creation
        if 'position' in self.attributes:
            self._update_surface()

    def _update_surface(self):
        nx = self.width_segments + 1
        ny = self.height_segments + 1
        x = np.linspace(-self.width/2, self.width/2, nx)
        y = np.linspace(-self.height/2, self.height/2, ny)
        xx, yy = np.meshgrid(x, y)
        z = np.array(self.z).reshape((nx, ny))

        positions = np.dstack((xx, yy, z)).reshape(nx * ny, 3).astype(np.float32)

        dx, dy = np.gradient(z, self.width/nx, self.height/ny)
        normals = np.dstack((-dx, -dy, np.ones_like(dx))).reshape(nx * ny, 3).astype(np.float32)

        vmin = np.min(positions, 0)[:2]
        vrange = np.max(positions, 0)[:2] - vmin
        uvs = ((positions[:, :2] - vmin) / vrange)

        indices = np.array(tuple(grid_indices_gen(nx, ny)), dtype=np.uint16).ravel()

        if 'position' not in self.attributes:
            # Initial values:
            self.attributes = {
                'position': BufferAttribute(positions),
                'index': BufferAttribute(indices),
                'normal': BufferAttribute(normals),
                'uv': BufferAttribute(uvs),
            }
        else:
            # We're updating
            with self.hold_trait_notifications():
                self.attributes['position'].array = positions
                self.attributes['index'].array = indices
                self.attributes['normal'].array = normals
                self.attributes['uv'].array = uvs


def SurfaceGrid(geometry, material, **kwargs):
    """A grid covering a surface.

    This will draw a line mesh overlaying the SurfaceGeometry.
    """
    nx = geometry.width_segments + 1
    ny = geometry.height_segments + 1
    vertices = geometry.attributes['position'].array

    lines = []
    for x in range(nx):
        g = Geometry(vertices=[vertices[y * nx + x, :].tolist() for y in range(ny)])
        lines.append(Line(g, material))
    for y in range(ny):
        g = Geometry(vertices=[vertices[y * nx + x, :].tolist() for x in range(nx)])
        lines.append(Line(g, material))

    def _update_lines(change):
        vertices = geometry.attributes['position'].array
        for x in range(nx):
            g = lines[x].geometry
            g.vertices = [vertices[y * nx + x, :].tolist() for y in range(ny)]
        for y in range(ny):
            g = lines[nx + y].geometry
            g.vertices = [vertices[y * nx + x, :].tolist() for x in range(nx)]
    geometry.attributes['position'].observe(_update_lines, names=('array'))

    return Group(children=lines, **kwargs)


class PlotMesh(Mesh):
    plot = Instance('sage.plot.plot3d.base.Graphics3d')

    def _plot_changed(self, name, old, new):
        self.type = new.scenetree_json()['type']
        if self.type == 'object':
            self.type = new.scenetree_json()['geometry']['type']
            self.material = self.material_from_object(new)
        else:
            self.type = new.scenetree_json()['children'][0]['geometry']['type']
            self.material = self.material_from_other(new)
        if self.type == 'index_face_set':
            self.geometry = self.geometry_from_plot(new)
        elif self.type == 'sphere':
            self.geometry = self.geometry_from_sphere(new)
        elif self.type == 'box':
            self.geometry = self.geometry_from_box(new)

    def material_from_object(self, p):
        # TODO: do this without scenetree_json()
        t = p.texture.scenetree_json()
        m = MeshLambertMaterial(side='DoubleSide')
        m.color = t['color']
        m.opacity = t['opacity']
        # TODO: support other attributes
        return m

    def material_from_other(self, p):
        # TODO: do this without scenetree_json()
        t = p.scenetree_json()['children'][0]['texture']
        m = MeshLambertMaterial(side='DoubleSide')
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
        faces = {k: flatten(v) for k, v in groupby(f, len)}
        g.face3 = faces.get(3, [])
        g.face4 = faces.get(4, [])
        return g


# Some helper classes and functions
def lights_color():
    return [
        AmbientLight(color=(0.312, 0.188, 0.4)),
        DirectionalLight(position=[1, 0, 1], color=[.8, 0, 0]),
        DirectionalLight(position=[1, 1, 1], color=[0, .8, 0]),
        DirectionalLight(position=[0, 1, 1], color=[0, 0, .8]),
        DirectionalLight(position=[-1, -1, -1], color=[.9, .7, .9]),
    ]


def lights_gray():
    return [
        AmbientLight(color=[.6, .6, .6]),
        DirectionalLight(position=[0, 1, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[0, 0, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[1, 1, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[-1, -1, -1], color=[.7, .7, .7]),
    ]


def make_text(text, position=(0, 0, 0), height=1):
    """
    Return a text object at the specified location with a given height
    """
    sm = SpriteMaterial(map=TextTexture(string=text, color='white', size=100, squareTexture=False))
    return Sprite(material=sm, position=position, scaleToTexture=True, scale=[1, height, 1])


def height_texture(z, colormap='viridis'):
    """Create a texture corresponding to the heights in z and the given colormap."""
    from matplotlib import cm
    from skimage import img_as_ubyte

    colormap = cm.get_cmap(colormap)
    im = z.copy()
    # rescale to be in [0,1], scale nan to be the smallest value
    im -= np.nanmin(im)
    im /= np.nanmax(im)
    im = np.nan_to_num(im)

    import warnings
    with warnings.catch_warnings():
        # ignore the precision warning that comes from converting floats to uint8 types
        warnings.filterwarnings('ignore',
                                message='Possible precision loss when converting from',
                                category=UserWarning,
                                module='skimage.util.dtype')
        rgba_im = img_as_ubyte(colormap(im))  # convert the values to rgba image using the colormap

    return DataTexture(data=rgba_im, format='RGBAFormat')
