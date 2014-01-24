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

class Material(Widget):
    _view_name = Unicode('MaterialView', sync=True)
    color = Any('yellow', sync=True)
    opacity = CFloat(1.0, sync=True)
    wireframe = Bool(False, sync=True)

class Mesh(Object3d):
    __view_name = Unicode('MeshView', sync=True)
    geometry = Instance(Geometry, sync=True)
    material = Instance(Material, sync=True)

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

class PositionLight(Light):
    _view_name = Unicode('PositionLight', sync=True)
    intensity = CFloat(1, sync=True)
    
class DirectionalLight(PositionLight):
    _view_name = Unicode('DirectionalLight', sync=True)

class PointLight(PositionLight):
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
