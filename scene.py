"""
Making python proxies for javascript objects:

Basic approaches:

1. Make equivalent python classes to the JS objects.  Every python function call triggers a js function call.  The attributes aren't stored; if they are requested on the python side, they are retrieved when they are requested.

2. Make python objects that mirror the data structures on the js side, and sync these attributes when needed.  Benefit is that local access is fast, but disadvantage is that it requires more work.  Or maybe only selected attributes are synced, and other attributes are retrieved/set in real-time.

3. High-level interface (a simplified higher-level interface)

#3 isn't as good, I think, for low-level control.  #1 is fastest to make, but supporting blocking calls to get attributes is tricky (since we need to stop the process in order to process messages)

So #2 looks like the way to go, and the way the HasTraits widgets go.  Basic state includes:

* matrix4
* parameters:
  - lights:
  - textures
  - geometries
* higher-level objects: planes, spheres, cylinders, etc.

TODO: how to wrap things programmatically.  I want a simple way to specify the keys

"""

from IPython.html.widgets.widget import Widget
from IPython.utils.traitlets import Unicode, Int, Bool, List,  Dict, List, Instance


#-----------------------------------------------------------------------------
# Classes
#-----------------------------------------------------------------------------
class ObjectWidget(Widget):
    target_name = Unicode('ObjectWidgetModel')
    default_view_name = Unicode('ObjectView')

    # Keys
    _keys = ['position']
    # methods: lookAt

class SceneWidget(ObjectWidget):
    target_name = Unicode('SceneWidgetModel')
    default_view_name = Unicode('SceneView')
    _keys = ['width', 'height']

class CameraWidget(ObjectWidget):
    target_name = Unicode('CameraWidgetModel')
    default_view_name = Unicode('CameraView')    
    _keys = ObjectWidget._keys+['type', 'fov', 'near', 'far']
    
class LightWidget(ObjectWidget):
    target_name = Unicode('LightWidgetModel')
    default_view_name = Unicode('LightView')    

class Color(Widget):
    _keys = ['r', 'g', 'b']
    
class AmbientLightWidget(LightWidget):
    _keys = LightWidget._keys+['color']
    color = Instance(Color)
    
class DirectionalLightWidget(LightWidget):
    pass

class Material(Widget):
    pass

class PhongMaterial(Material):
    pass

class LambertMaterial(Material):
    pass

class Geometry(Widget):
    pass

class Sphere(Geometry):
    def __init__(self, radius=1):
        self.radius = radius

class MeshWidget(ObjectWidget):
    _keys = ObjectWidget._keys + ['material', 'geometry']

    material = Instance(Material)
    geometry = Instance(Geometry)
    
class SurfaceWidget(MeshWidget):
    pass
