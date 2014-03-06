# Import the base Widget class and the traitlets Unicode class.
from IPython.html.widgets.widget import Widget, DOMWidget
from IPython.utils.traitlets import (Unicode, Int, Instance, Enum, List, Float, 
                                     Any, CFloat, Bool, This, CInt, TraitType)
import numpy
import math

def vector3(trait_type=CFloat, default=None, **kwargs):
    if default is None: 
        default=[0,0,0]
    return List(trait_type, default_value=default, 
                minlen=3, maxlen=3, allow_none=False, **kwargs)

class Texture(Widget):
    _view_name = Unicode('TextureView', sync=True)

class ImageTexture(Texture):
    _view_name = Unicode('ImageTextureView', sync=True)
    imageuri = Unicode('',sync=True)

class DataTexture(Texture):
    _view_name = Unicode('DataTextureView', sync=True)
    data = Any(sync=True)
    format = Unicode('',sync=True)

# python 3 compatibility stuff
# http://www.voidspace.org.uk/python/articles/porting-mock-to-python-3.shtml
try:
    unicode
except NameError:
    # Python 3
    basestring = unicode = str

class Color(TraitType):
    default_value = 'black'
    info_text = 'a color as an rgb tuple, an integer, or a string'

    def validate(self, obj, value):
        if isinstance(value, (tuple, list)) and len(value)==3:
            return 'rgb(%d,%d,%d)'%(int(value[0]), int(value[1]), int(value[2]))
        elif isinstance(value, basestring):
            # from https://github.com/mrdoob/three.js/blob/master/src/math/Color.js
            # there are lots of color names, as well as things like
            # rgb(?,?,?), rgb(?%,?%,?%), #XXXXXX, #XXX
            # TODO: validate one of those patterns, or just pass the buck to three.js
            return value
        else:
            try:
                return int(value)
            except:
                pass
        self.error(obj, value)

class Object3d(Widget):
    """
    If matrix is not None, it overrides the position, rotation, scale, and up variables.
    """
    _view_name = Unicode('Object3dView', sync=True)
    position = vector3(CFloat, sync=True)
    rotation = vector3(CFloat, sync=True)
    scale = vector3(CFloat, [1,1,1], sync=True)
    up = vector3(CFloat, [0,1,0], sync=True)
    visible = Bool(True, sync=True)
    castShadow = Bool(False, sync=True)
    receiveShadow = Bool(False, sync=True)
    # FYI, this matrix has the translation in the 4th row, which is is the
    # transpose of Sage's transformation matrices
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
    
class BoxGeometry(Geometry):
    _view_name = Unicode('BoxGeometryView', sync=True)
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
    
class LatheGeometry(Geometry):
    _view_name = Unicode('LatheGeometryView', sync=True)
    points = List(vector3(), sync=True)
    segments = CInt(12, sync=True)
    phiStart = CFloat(0, sync=True)
    phiLength = CFloat(2*math.pi, sync=True)
    
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
    detail = CInt(0, sync=True)
    vertices = List(List(CFloat), sync=True)
    faces = List(List(CInt), sync=True)

class RingGeometry(Geometry):
    _view_name = Unicode('RingGeometryView', sync=True)
    innerRadius = CFloat(1.0, sync=True)
    outerRadius = CFloat(3.0, sync=True)
    thetaSegments = CInt(8, sync=True)
    phiSegments = CInt(8, sync=True)
    thetaStart = CFloat(0, sync=True)
    thetaLength = CFloat(math.pi*2, sync=True)

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

class ParametricGeometry(Geometry):
    _view_name = Unicode('ParametricGeometryView', sync=True)
    func = Unicode('', sync=True)
    slices = CInt(105, sync=True)
    stacks = CInt(105,sync=True)
    
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
    color = Color('yellow', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)
    wireframeLinecap = Unicode('round', sync=True)
    wireframeLinejoin = Unicode('round', sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading', sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)
    fog = Bool(False, sync=True)
    map = Instance(Texture, sync=True)
    lightMap = Instance(Texture, sync=True)
    specularMap = Instance(Texture, sync=True)
    envMap = Instance(Texture, sync=True)
    skinning = Bool(False, sync=True)
    morphTargets = Bool(False, sync=True)

class LambertMaterial(BasicMaterial):
    _view_name = Unicode('LambertMaterialView', sync=True)
    ambient = Color('white', sync=True)
    emissive = Color('black', sync=True)
    reflectivity = CFloat(1.0, sync=True)
    refractionRatio = CFloat(0.98, sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'], 'MultiplyOperation', sync=True)
    
class PhongMaterial(BasicMaterial):
    _view_name = Unicode('PhongMaterialView', sync=True)
    ambient = Color('white', sync=True)
    emissive = Color('black', sync=True)
    specular = Color('darkgray', sync=True)
    shininess = CFloat(30, sync=True)
    reflectivity = CFloat(1.0, sync=True)
    refractionRatio = CFloat(0.98, sync=True)
    combine = Enum(['MultiplyOperation', 'MixOperation', 'AddOperation'], 'MultiplyOperation', sync=True)
    
class DepthMaterial(Material):
    _view_name = Unicode('DepthMaterialView', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)

class LineBasicMaterial(Material):
    _view_name = Unicode('LineBasicMaterialView', sync=True)
    color = Color('yellow', sync=True)
    linewidth = CFloat(1.0, sync=True)
    linecap = Unicode('round', sync=True)
    linejoin = Unicode('round', sync=True)
    fog = Bool(False, sync=True) 
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)

class LineDashedMaterial(Material):
    _view_name = Unicode('LineDashedMaterialView', sync=True)
    color = Color('yellow', sync=True)
    linewidth = CFloat(1.0, sync=True)
    scale = CFloat(1.0, sync=True)
    dashSize = CFloat(3.0, sync=True)
    gapSize = CFloat(1.0, sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)
    fog = Bool(False, sync=True)

class NormalMaterial(Material):
    _view_name = Unicode('NormalMaterialView', sync=True)
    morphTargets = Bool(False, sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)

class ParticleSystemMaterial(Material):
    _view_name = Unicode('ParticleSystemMaterialView', sync=True)
    color = Color('yellow', sync=True)
    map = Instance(Texture, sync=True)
    size = CFloat(1.0, sync=True)
    sizeAttenuation = Bool(False, sync=True)
    vertexColors = Bool(False, sync=True)
    fog = Bool(False, sync=True)

class ShaderMaterial(Material):
    _view_name = Unicode('ShaderMaterialView', sync=True)
    fragmentShader = Unicode('void main(){ }', sync=True)
    vertexShader = Unicode('void main(){ }', sync=True)
    morphTargets = Bool(False, sync=True)
    lights = Bool(False, sync=True)
    morphNormals = Bool(False, sync=True)
    wireframe = Bool(False, sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)
    skinning = Bool(False, sync=True)
    fog = Bool(False, sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading', sync=True)
    linewidth = CFloat(1.0, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)

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

class PerspectiveCamera(Camera):
    _view_name = Unicode('PerspectiveCameraView', sync=True)
    fov = CFloat(50.0, sync=True)
    aspect = CFloat(6.0/4.0, sync=True)
    near = CFloat(0.1, sync=True)
    far = CFloat(2000.0, sync=True)

class OrthographicCamera(Camera):
    _view_name = Unicode('OrthographicCameraView', sync=True)
    left = CFloat(-10.0, sync=True)
    right = CFloat(10.0, sync=True)
    top = CFloat(-10.0, sync=True)
    bottom = CFloat(10.0, sync=True)
    near = CFloat(0.1, sync=True)
    far = CFloat(2000.0, sync=True)
    
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
    color = Color('white', sync=True) # could be string or number or tuple

class AmbientLight(Light):
    _view_name = Unicode('AmbientLight', sync=True)

class IntensityLight(Light):
    _view_name = Unicode('PositionLight', sync=True)
    intensity = CFloat(1, sync=True)

class HemisphereLight(IntensityLight):
    _view_name = Unicode('HemisphereLight', sync=True)
    ground_color = Color('blue', sync=True) # could be string, number, or RGB tuple

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
