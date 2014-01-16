# Import the base Widget class and the traitlets Unicode class.
from IPython.html.widgets.widget import Widget, DOMWidget
from IPython.utils.traitlets import (Unicode, Int, Instance, Enum, List, Float, 
                                     Any, CFloat, Bool, This, CInt)
import numpy

def vector3(trait_type, default=None):
    if default is None: 
        default=[0,0,0]
    return List(trait_type, default_value=default, 
                minlen=3, maxlen=3, allow_none=False)


class Object3d(Widget):
    """
    If matrix is not None, it overrides the position, rotation, scale, and up variables.
    """
    keys = ['position', 'rotation', 'scale', 'up', 
             'visible', 'castShadow', 'receiveShadow', 
             'matrix',
             'children'] + Widget.keys
    position = vector3(CFloat)
    rotation = vector3(CFloat)
    scale = vector3(CFloat, [1,1,1])
    up = vector3(CFloat, [0,1,0])
    visible = Bool(True)
    castShadow = Bool(False)
    receiveShadow = Bool(False)
    matrix = List(CFloat)
    # TODO: figure out how to get a list of instances of Object3d
    children = List(trait=None, default_value=[], allow_none=False)

class Controls(Widget):
    view_name = Unicode('ControlsView')
    keys = ['controlling'] + Widget.keys
    controlling = Instance(Object3d)

class OrbitControls(Controls):
    view_name = Unicode('OrbitControlsView')
    
class Geometry(Widget):
    view_name = Unicode('GeometryView')

class SphereGeometry(Geometry):
    view_name = Unicode('SphereGeometryView')
    keys = ['radius'] + Geometry.keys
    radius = CFloat(1)

class SurfaceGeometry(Geometry):
    """
    A regular grid with heights
    """
    view_name = Unicode('SurfaceGeometryView')
    keys = ['z', 'width', 'height', 'width_segments', 'height_segments'] + Geometry.keys
    z = List(CFloat, [0]*100)
    width = CInt(10)
    height = CInt(10)
    width_segments = CInt(10)
    height_segments = CInt(10)

class Material(Widget):
    view_name = Unicode('MaterialView')
    keys = ['color', 'opacity', 'wireframe'] + Widget.keys
    color = Any('yellow')
    opacity = CFloat(1.0)
    wireframe = Bool(False)

class Mesh(Object3d):
    view_name = Unicode('MeshView')
    keys = ['geometry', 'material'] + Object3d.keys
    geometry = Instance(Geometry)
    material = Instance(Material)

class Camera(Object3d):
    view_name = Unicode('CameraView')
    keys = ['fov', 'ratio'] + Object3d.keys
    fov = CFloat(40)
    ratio = CFloat(600.0/400.0)
    
class Scene(Object3d):
    view_name = Unicode('SceneView') 
    
class Renderer(DOMWidget):
    view_name = Unicode('RendererView')
    keys = ['width', 'height', 'renderer_type', 'scene', 'camera', 'controls'] + DOMWidget.keys
    width = CInt(600)
    height = CInt(400)
    renderer_type = Enum(['webgl', 'canvas', 'auto'], 'auto')
    scene = Instance(Scene)
    camera = Instance(Camera)
    controls = Instance(Controls)

    
class Light(Object3d):
    keys = ['color']+Object3d.keys
    color = Any('white') # could be string or number or tuple

class AmbientLight(Light):
    view_name = 'AmbientLight'

class PositionLight(Light):
    keys = ['intensity'] + Light.keys
    view_name = 'PositionLight'
    intensity = CFloat(1)
    
class DirectionalLight(PositionLight):
    view_name = 'DirectionalLight'

class PointLight(PositionLight):
    keys = ['distance'] + PositionLight.keys
    view_name = 'PointLight'
    distance = CFloat()

class SpotLight(PointLight):
    keys = ['angle', 'exponent'] + PointLight.keys
    view_name = 'SpotLight'
    angle = CFloat()
    exponent = CFloat()
    

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
