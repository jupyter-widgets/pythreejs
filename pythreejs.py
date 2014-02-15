# Import the base Widget class and the traitlets Unicode class.
from IPython.html.widgets.widget import Widget, DOMWidget
from IPython.utils.traitlets import (Unicode, Int, Instance, Enum, List, Float, 
                                     Any, CFloat, Bool, This, CInt)
import numpy

def vector3(trait_type, default=None, **kwargs):
    if default is None: 
        default=[0,0,0]
    return List(trait_type, default_value=default, 
                minlen=3, maxlen=3, allow_none=False, **kwargs)


class Object3d(Widget):
    """
    If matrix is not None, it overrides the position, rotation, scale, and up variables.
    """
    position = vector3(CFloat, sync=True)
    rotation = vector3(CFloat, sync=True)
    scale = vector3(CFloat, [1,1,1], sync=True)
    up = vector3(CFloat, [0,1,0], sync=True)
    visible = Bool(True, sync=True)
    castShadow = Bool(False, sync=True)
    receiveShadow = Bool(False, sync=True)
    matrix = List(CFloat, sync=True)
    # TODO: figure out how to get a list of instances of Object3d
    children = List(trait=None, default_value=[], allow_none=False, sync=True)

class Controls(Widget):
    _view_name = Unicode('ControlsView', sync=True)
    controlling = Instance(Object3d, sync=True)

class OrbitControls(Controls):
    _view_name = Unicode('OrbitControlsView', sync=True)
    
class Geometry(Widget):
    _view_name = Unicode('GeometryView', sync=True)

class SphereGeometry(Geometry):
    _view_name = Unicode('SphereGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    
class CylinderGeometry(Geometry):
    _view_name = Unicode('CylinderGeometryView', sync=True)
    radiusTop = CFloat(1, sync=True)
    radiusBottom = CFloat(1, sync=True)
    height = CFloat(1, sync=True)
    radiusSegments = CFloat(1, sync=True)
    heightSegments = CFloat(1, sync=True)
    openEnded = Bool(False, sync=True)
    
class CubeGeometry(Geometry):
    _view_name = Unicode('CubeGeometryView', sync=True)
    width = CFloat(1, sync=True)
    height = CFloat(1, sync=True)
    depth = CFloat(1, sync=True)
    widthSegments = CFloat(1, sync=True)
    heightSegments = CFloat(1, sync=True)
    depthSegments = CFloat(1, sync=True)
    
class CircleGeometry(Geometry):
    _view_name = Unicode('CircleGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    segments = CFloat(8, sync=True)
    thetaStart = CFloat(0, sync=True)
    thetaLength = CFloat(2*math.pi, sync=True)
    
class IcosahedronGeometry(Geometry):
    _view_name = Unicode('IcosahedronGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    detail = CFloat(0, sync=True)
    
class OctahedronGeometry(Geometry):
    _view_name = Unicode('OctahedronGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    detail = CFloat(0, sync=True)
    
class PlaneGeometry(Geometry):
    _view_name = Unicode('PlaneGeometryView', sync=True)
    width = CFloat(1, sync=True)
    height = CFloat(1, sync=True)
    widthSegments = CFloat(1, sync=True)
    heightSegments = CFloat(1, sync=True)
    
class TetrahedronGeometry(Geometry):
    _view_name = Unicode('TetrahedronGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    detail = CFloat(0, sync=True)
    
class TorusGeometry(Geometry):
    _view_name = Unicode('TorusGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    tube = CFloat(1, sync=True)
    radialSegments = CFloat(1, sync=True)
    tubularSegments = CFloat(1, sync=True)
    arc = CFloat(math.pi*2, sync=True)
    
class TorusKnotGeometry(Geometry):
    _view_name = Unicode('TorusKnotGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    tube = CFloat(1, sync=True)
    radialSegments = CFloat(10, sync=True)
    tubularSegments = CFloat(10, sync=True)
    p = CFloat(2, sync=True)
    q = CFloat(3, sync=True)
    heightScale = CFloat(1, sync=True)
    
class PolyhedronGeometry(Geometry):
    _view_name = Unicode('PolyhedronGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    detail = Int(0, sync=True)
    vertices = List(List(CFloat), sync=True)
    faces = List(List(CInt), sync=True)

class SurfaceGeometry(Geometry):
    """
    A regular grid with heights
    """
    _view_name = Unicode('SurfaceGeometryView', sync=True)
    z = List(CFloat, [0]*100, sync=True)
    width = CInt(10, sync=True)
    height = CInt(10, sync=True)
    width_segments = CInt(10, sync=True)
    height_segments = CInt(10, sync=True)

class FaceGeometry(Geometry):
    """
    List of vertices and faces
    """
    _view_name = Unicode('FaceGeometryView', sync=True)
    vertices = List(CFloat, sync=True) # [x0, y0, z0, x1, y1, z1, x2, y2, z2, ...]
    face3 = List(CInt, sync=True) # [v0,v1,v2, v0,v1,v2, v0,v1,v2, ...]
    face4 = List(CInt, sync=True) # [v0,v1,v2,v3, v0,v1,v2,v3, v0,v1,v2,v3, ...]
    
class Material(Widget):
    _view_name = Unicode('MaterialView', sync=True)
    # id = TODO
    name = Unicode('', sync=True) 
    side = Enum(['FrontSide', 'BackSide', 'DoubleSide'], 'FrontSide',  sync=True) 
    opacity = CFloat(1.0, sync=True)
    transparent = Bool(False, sync=True)
    blending = Enum(['NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending', 'MultiplyBlending', 'CustomBlending'], 'NormalBlending', sync=True) 
    blendSrc = Enum(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor'], 'SrcAlphaFactor', sync=True) 
    blendDst = Enum(['DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'], 'OneMinusDstColorFactor', sync=True) # add to js side
    blendEquation = Enum(['AddEquation', 'SubtractEquation', 'ReverseSubtractEquation'], 'AddEquation', sync=True) # add to js side
    depthTest = Bool(True, sync=True) 
    depthWrite = Bool(True, sync=True) 
    polygonOffset = Bool(False, sync=True) 
    polygonOffsetFactor = CFloat(1.0, sync=True) 
    polygonOffsetUnits = CFloat(1.0, sync=True) 
    alphaTest = CFloat(1.0, sync=True) 
    overdraw = CFloat(1.0, sync=True) 
    visible = Bool(True, sync=True) 
    needsUpdate = Bool(True, sync=True) 
    
class BasicMaterial(Material):
    _view_name = Unicode('BasicMaterialView', sync=True)
    color = Unicode('yellow', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)
    wireframeLinecap = Unicode('round', sync=True)
    wireframeLinejoin = Unicode('round', sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading', sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)
    fog = Bool(False, sync=True)
    lightMap = Any(None, sync=True)
    specularMap = Any(None, sync=True)
    envMap = Any(None, sync=True)
    skinning = Bool(False, sync=True)
    morphTargets = Bool(False, sync=True)

class LambertMaterial(BasicMaterial):
    _view_name = Unicode('LambertMaterialView', sync=True)
    ambient = Unicode('white', sync=True)
    emissive = Unicode('black', sync=True)
    reflectivity = CFloat(1.0, sync=True)
    refractionRatio = CFloat(0.98, sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'], 'MultiplyOperation', sync=True)
    
class PhongMaterial(BasicMaterial):
    _view_name = Unicode('PhongMaterialView', sync=True)
    ambient = Any('white', sync=True)
    emissive = Any('black', sync=True)
    specular = Any('darkgray', sync=True)
    shininess = CFloat(30, sync=True)
    reflectivity = CFloat(1.0, sync=True)
    refractionRatio = CFloat(0.98, sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'], 'MultiplyOperation', sync=True)
    
class DepthMaterial(Material):
    _view_name = Unicode('DepthMaterialView', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)

class LineBasicMaterial(Material):
    _view_name = Unicode('LineBasicMaterial', sync=True)
    color = Any('yellow', sync=True)
    linewidth = CFloat(1.0, sync=True)
    linecap = Any('round', sync=True)#todo Enum
    linejoin = Any('round', sync=True)#todo Enum
    fog = Bool(False, sync=True) 
    vertexColors = Bool(False, sync=True)

class Mesh(Object3d):
    _view_name = Unicode('MeshView', sync=True)
    geometry = Instance(Geometry, sync=True)
    material = Instance(Material, sync=True)

class PlotMesh(Mesh):
    plot = Instance('sage.plot.plot3d.base.Graphics3d')

    def _plot_changed(self, name, old, new):
        self.geometry = self.geometry_from_plot(new)
        self.material = self.material_from_plot(new)

    def material_from_plot(self, p):
        # TODO: do this without scenetree_json()
        t = p.texture.scenetree_json()
        m = Material()
        m.color = t['color']
        m.opacity = t['opacity']
        # TODO: support other attributes
        return m

    def geometry_from_plot(self, p):
        from itertools import groupby, chain
        def flatten(ll):
            return list(chain.from_iterable(ll))
        p.triangulate()

        g = FaceGeometry()
        g.vertices = flatten(p.vertices())
        f = p.index_faces()
        f.sort(key=len)
        faces = {k:flatten(v) for k,v in groupby(f,len)}
        g.face3 = faces.get(3,[])
        g.face4 = faces.get(4,[])
        return g

class Camera(Object3d):
    _view_name = Unicode('CameraView', sync=True)
    fov = CFloat(40, sync=True)
    ratio = CFloat(600.0/400.0, sync=True)
    
class Scene(Object3d):
    _view_name = Unicode('SceneView', sync=True)
    
class Renderer(DOMWidget):
    _view_name = Unicode('RendererView', sync=True)
    width = CInt(600, sync=True)
    height = CInt(400, sync=True)
    renderer_type = Enum(['webgl', 'canvas', 'auto'], 'auto', sync=True)
    scene = Instance(Scene, sync=True)
    camera = Instance(Camera, sync=True)
    controls = Instance(Controls, sync=True)

    
class Light(Object3d):
    color = Any('white', sync=True) # could be string or number or tuple

class AmbientLight(Light):
    _view_name = Unicode('AmbientLight', sync=True)

class IntensityLight(Light):
    _view_name = Unicode('PositionLight', sync=True)
    intensity = CFloat(1, sync=True)

class HemisphereLight(IntensityLight):
    _view_name = Unicode('HemisphereLight', sync=True)
    ground_color = Any('blue', sync=True) # could be string, number, or RGB tuple

class DirectionalLight(IntensityLight):
    _view_name = Unicode('DirectionalLight', sync=True)

class PointLight(IntensityLight):
    _view_name = Unicode('PointLight', sync=True)
    distance = CFloat(10, sync=True)

class SpotLight(PointLight):
    _view_name = Unicode('SpotLight', sync=True)
    angle = CFloat(10, sync=True)
    exponent = CFloat(0.5, sync=True)
    

lights = {
    'colors': [
        AmbientLight(color=(0.312,0.188,0.4)),
        DirectionalLight(position=[1,0,1], color=[0.8, 0, 0]),
        DirectionalLight(position=[1,1,1], color=[0, 0.8, 0]),
        DirectionalLight(position=[0,1,1], color=[0, 0, 0.8]),
        DirectionalLight(position=[-1,-1,-1], color=[.9,.7,.9]),
        ],
    'shades': [
        AmbientLight(color=[.6, .6, .6]),
        DirectionalLight(position=[0,1,1], color=[.5, .5, .5]),
        DirectionalLight(position=[0,0,1], color=[.5, .5, .5]),
        DirectionalLight(position=[1,1,1], color=[.5, .5, .5]),
        DirectionalLight(position=[-1,-1,-1], color=[.7,.7,.7]),
        ],
    }


import contextlib
class Connect(object):
    """Connect traits from different objects together so they remain in sync.

    Parameters
    ----------
    obj : pairs of objects/attributes

    Examples
    --------

    >>> c = Connect((obj1, 'value'), (obj2, 'value'), (obj3, 'value'))
    >>> obj1.value = 5 # updates other objects as well
    """
    updating = False
    def __init__(self, *args):

        self.objects = args
        for obj,attr in args:
            obj.on_trait_change(self._update, attr)

    @contextlib.contextmanager
    def _busy_updating(self):
        self.updating = True
        yield
        self.updating = False

    def _update(self, name, old, new):
        if self.updating:
            return
        with self._busy_updating():
            for obj,attr in self.objects:
                setattr(obj, attr, new)

    def disconnect(self):
        for obj,attr in self.objects:
            obj.on_trait_change(self._update, attr, remove=True)

