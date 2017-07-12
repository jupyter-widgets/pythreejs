r"""
Python widgets for three.js plotting

In this wrapping of three.js, we try to stay close to the three.js API. Often,
the three.js documentation at http://threejs.org/docs/ helps in understanding
these classes and the various constants.

This is meant to be a low-level wrapper around three.js. We hope that others
will use this foundation to build higher-level interfaces to build 3d plots.

Another resource to understanding three.js decisions is the Udacity course on
3d graphics using three.js: https://www.udacity.com/course/cs291
"""

from __future__ import absolute_import

from ipywidgets import Widget, widget_serialization, Color
from traitlets import Unicode, CInt, Instance, Enum, List, CFloat, Bool
import numpy as np

from ._package import npm_pkg_name
from .enums import Shading, Colors
from ._version import EXTENSION_VERSION


from .core.Object3D import Object3D
from .core.Geometry_autogen import Geometry
from .geometries.BoxGeometry_autogen import BoxGeometry
from .geometries.SphereGeometry_autogen import SphereGeometry
from .lights.AmbientLight_autogen import AmbientLight
from .lights.DirectionalLight_autogen import DirectionalLight
from .materials.Material_autogen import Material
from .materials.MeshLambertMaterial_autogen import MeshLambertMaterial
from .materials.SpriteMaterial_autogen import SpriteMaterial
from .objects.Mesh_autogen import Mesh
from .objects.Sprite_autogen import Sprite
from .textures.Texture_autogen import Texture
from .textures.DataTexture_autogen import DataTexture
from .textures.TextTexture_autogen import TextTexture


def vector3(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [0, 0, 0]
    return List(trait_type, default_value=default, minlen=3, maxlen=3, **kwargs)

def vector2(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [0, 0]
    return List(trait_type, default_value=default, minlen=2, maxlen=2, **kwargs)


class ScaledObject(Object3D):
    """
    This object's matrix will be scaled every time the camera is adjusted, so
    that the object is always the same size in the viewport.

    The idea is that it is the parent for objects you want to maintain the same scale.
    """
    _view_name = Unicode('ScaledObjectView').tag(sync=True)
    _model_name = Unicode('ScaledObjectModel').tag(sync=True)


# class Picker(Controls):
#     _view_name = Unicode('PickerView').tag(sync=True)
#     _model_name = Unicode('PickerModel').tag(sync=True)

#     event = Unicode('click').tag(sync=True)
#     root = Instance(Object3D, allow_none=True).tag(sync=True, **widget_serialization)
#     picked = List(Dict).tag(sync=True)
#     distance = CFloat().tag(sync=True)
#     point = vector3(CFloat).tag(sync=True)
#     object = Instance(Object3D, allow_none=True).tag(sync=True, **widget_serialization)
#     face = vector3(CInt).tag(sync=True)
#     faceNormal = vector3(CFloat).tag(sync=True)
#     faceVertices = List(vector3()).tag(sync=True)
#     faceIndex = CInt().tag(sync=True)
#     all = Bool().tag(sync=True)


class SurfaceGeometry(Geometry):
    """
    A regular grid with heights
    """
    _view_name = Unicode('SurfaceGeometryView').tag(sync=True)
    _model_name = Unicode('SurfaceGeometryModel').tag(sync=True)

    z = List(CFloat, [0] * 100).tag(sync=True)
    width = CInt(10).tag(sync=True)
    height = CInt(10).tag(sync=True)
    width_segments = CInt(10).tag(sync=True)
    height_segments = CInt(10).tag(sync=True)


class FaceGeometry(Geometry):
    """
    List of vertices and faces
    """
    _view_name = Unicode('FaceGeometryView').tag(sync=True)
    _model_name = Unicode('FaceGeometryModel').tag(sync=True)

    vertices = List(CFloat).tag(sync=True)  # [x0, y0, z0, x1, y1, z1, x2, y2, z2, ...]
    face3 = List(CInt).tag(sync=True)  # [v0,v1,v2, v0,v1,v2, v0,v1,v2, ...]
    face4 = List(CInt).tag(sync=True)  # [v0,v1,v2,v3, v0,v1,v2,v3, v0,v1,v2,v3, ...]
    facen = List(List(CInt)).tag(sync=True)  # [[v0,v1,v2,...,vn], [v0,v1,v2,...,vn], [v0,v1,v2,...,vn], ...]


# class ParametricGeometry(Geometry):
#     _view_name = Unicode('ParametricGeometryView').tag(sync=True)
#     _model_name = Unicode('ParametricGeometryModel').tag(sync=True)

#     func = Unicode(sync=True)
#     slices = CInt(105).tag(sync=True)
#     stacks = CInt(105).tag(sync=True)


class ParticleSystemMaterial(Material):
    _view_name = Unicode('ParticleSystemMaterialView').tag(sync=True)
    _model_name = Unicode('ParticleSystemMaterialModel').tag(sync=True)

    color = Color('yellow').tag(sync=True)
    map = Instance(Texture, allow_none=True).tag(sync=True, **widget_serialization)
    size = CFloat(1.0).tag(sync=True)
    sizeAttenuation = Bool().tag(sync=True)
    vertexColors = Bool().tag(sync=True)
    fog = Bool().tag(sync=True)


class ShaderMaterial(Material):
    _view_name = Unicode('ShaderMaterialView').tag(sync=True)
    _model_name = Unicode('ShaderMaterialModel').tag(sync=True)

    fragmentShader = Unicode('void main(){ }').tag(sync=True)
    vertexShader = Unicode('void main(){ }').tag(sync=True)
    morphTargets = Bool().tag(sync=True)
    lights = Bool().tag(sync=True)
    morphNormals = Bool().tag(sync=True)
    wireframe = Bool().tag(sync=True)
    vertexColors = Enum(Colors, 'NoColors').tag(sync=True)
    skinning = Bool().tag(sync=True)
    fog = Bool().tag(sync=True)
    shading = Enum(Shading, 'SmoothShading').tag(sync=True)
    linewidth = CFloat(1.0).tag(sync=True)
    wireframeLinewidth = CFloat(1.0).tag(sync=True)



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


class Effect(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_VERSION).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_VERSION).tag(sync=True)


class AnaglyphEffect(Effect):
    _view_name = Unicode('AnaglyphEffectView').tag(sync=True)
    _model_name = Unicode('AnaglyphEffectModel').tag(sync=True)


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


class SurfaceGrid(Mesh):
    """A grid covering a surface.

    This will draw a line mesh overlaying the SurfaceGeometry.
    """
    _view_name = Unicode('SurfaceGridView').tag(sync=True)
    _model_name = Unicode('SurfaceGridModel').tag(sync=True)

    geometry = Instance(SurfaceGeometry).tag(sync=True, **widget_serialization)
    material = Instance(Material).tag(sync=True, **widget_serialization)


def make_text(text, position=(0, 0, 0), height=1):
    """
    Return a text object at the specified location with a given height
    """
    sm = SpriteMaterial(map=TextTexture(string=text, color='white', size=100, squareTexture=False))
    return Sprite(material=sm, position=position, scaleToTexture=True, scale=[1, height, 1])


def height_texture(z, colormap = 'viridis'):
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

    rgba_list = list(rgba_im.flat)  # make a flat list

    return DataTexture(data=rgba_list, format='RGBAFormat', width=z.shape[1], height=z.shape[0])
