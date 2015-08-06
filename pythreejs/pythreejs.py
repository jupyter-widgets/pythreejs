r"""
Python widgets for three.js plotting

In this wrapping of three.js, we try to stay close to the three.js API.  Often, the three.js documentation at http://threejs.org/docs/ helps in understanding these classes and the various constants.  This is meant to be a low-level wrapper around three.js.  We hope that others will use this foundation to build higher-level interfaces to build 3d plots.

Another resource to understanding three.js decisions is the Udacity course on 3d graphics using three.js: https://www.udacity.com/course/cs291
"""


# Import the base Widget class and the traitlets Unicode class.
try:
    from ipywidgets import Widget, DOMWidget, widget_serialization
    from traitlets import (Unicode, Int, Instance, Enum, List, Dict, Float,
                           Any, CFloat, Bool, This, CInt, TraitType)
except ImportError:  # IPython 3.x
    from IPython.html.widgets.widget import Widget, DOMWidget
    from IPython.utils.traitlets import (Unicode, Int, Instance, Enum, List, Dict, Float,
                                         Any, CFloat, Bool, This, CInt, TraitType)
    widget_serialization = {}
from math import pi, sqrt

def vector3(trait_type=CFloat, default=None, **kwargs):
    if default is None: 
        default=[0,0,0]
    return List(trait_type, default_value=default, 
                minlen=3, maxlen=3, allow_none=False, **kwargs)

def vector2(trait_type=CFloat, default=None, **kwargs):
    if default is None: 
        default=[0,0]
    return List(trait_type, default_value=default, 
                minlen=2, maxlen=2, allow_none=False, **kwargs)



# python 3 compatibility stuff
# http://www.voidspace.org.uk/python/articles/porting-mock-to-python-3.shtml
try:
    unicode
except NameError:
    # Python 3
    basestring = unicode = str

class Color(TraitType):
    """A color trait.

    This takes a color represented as:

    * a string of the form ``'rgb(255, 0, 0)'``, ``'rgb(100%, 0%, 0%)'``, ``'#ff0000'``, ``'#f00'``, or a color name (see the THREE.ColorKeywords listing at https://github.com/mrdoob/three.js/blob/master/src/math/Color.js)
    * an rgb tuple/list of numbers, each between 0 and 1
    * an integer (or hex value)
    """
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

class Texture(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _view_name = Unicode('TextureView', sync=True)

class ImageTexture(Texture):
    """An image texture.

    The imageuri can be a data url or a web url.
    """
    _view_name = Unicode('ImageTextureView', sync=True)
    imageuri = Unicode('',sync=True)

class DataTexture(Texture):
    """A data-based texture.

    See http://threejs.org/docs/#Reference/Textures/DataTexture.  
    """
    _view_name = Unicode('DataTextureView', sync=True)
    data = List(CInt, sync=True)
    format = Enum(['RGBAFormat', 'AlphaFormat', 'RGBFormat', 'LuminanceFormat', 'LuminanceAlphaFormat'],
                'RGBAFormat', sync=True)
    width = CInt(256, sync=True)
    height = CInt(256, sync=True)
    type = Enum(['UnsignedByteType', 'ByteType', 'ShortType', 'UnsignedShortType', 'IntType',
                'UnsignedIntType', 'FloatType', 'UnsignedShort4444Type', 'UnsignedShort5551Type',
                'UnsignedShort565Type'], 'UnsignedByteType', sync=True)
    mapping = Enum(['UVMapping', 'CubeReflectionMapping', 'CubeRefractionMapping', 'SphericalReflectionMapping',
                    'SphericalRefractionMapping'], 'UVMapping', sync=True)
    wrapS = Enum(['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping'], 'ClampToEdgeWrapping',
                sync=True)
    wrapT = Enum(['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping'], 'ClampToEdgeWrapping',
                sync=True)
    magFilter = Enum(['LinearFilter', 'NearestFilter'], 'LinearFilter', sync=True)
    minFilter = Enum(['NearestFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter',
                        'LinearFilter', 'LinearMipMapNearestFilter'], 'NearestFilter', sync=True)
    anisotropy = CInt(1, sync=True)

class TextTexture(Texture):
    _view_name = Unicode('TextTextureView', sync=True)
    fontFace = Unicode('Arial', sync=True)
    size = CInt(12, sync=True)
    color = Color('black', sync=True)
    string = Unicode('', sync=True)
    squareTexture = Bool(True, sync=True)

class Object3d(Widget):
    """
    If matrix is not None, it overrides the position, rotation, scale, and up variables.
    """
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _view_name = Unicode('Object3dView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('Object3dModel', sync=True)
    position = vector3(CFloat, sync=True)
    quaternion = List(CFloat, sync=True) # [x,y,z,w]
    scale = vector3(CFloat, [1,1,1], sync=True)
    up = vector3(CFloat, [0,1,0], sync=True)
    visible = Bool(True, sync=True)
    castShadow = Bool(False, sync=True)
    receiveShadow = Bool(False, sync=True)
    # FYI, this matrix has the translation in the 4th row, which is is the
    # transpose of Sage's transformation matrices
    # TODO: figure out how to get a list of instances of Object3d
    children = List(trait=None, default_value=[], allow_none=False, sync=True, **widget_serialization)

    def set_matrix(self, m):
        self.position = m[12:15]
        x = m[0:3]
        y = m[4:7]
        z = m[8:11]
        self.scale = [self.vector_length(x),
                        self.vector_length(y),
                        self.vector_length(z)]
        m=[]
        m.extend(x)
        m.extend(y)
        m.extend(z)
        self.quaternion_from_rotation(m)
        return self

    def quaternion_from_rotation(self, m):
        """
        m is a 3 by 3 matrix, as a list of rows.  The columns of this matrix are
        the vectors x, y, and z
        """
        #x = self.normalize(m[0:3])
        #y = self.normalize(m[3:6])
        #z = self.normalize(m[6:9])
        x = m[0:3]
        y = m[3:6]
        z = m[6:9]
        trace = x[0]+y[1]+z[2]
        if (trace>0):
            s = 0.5/sqrt(trace+1)
            self.quaternion = [(y[2]-z[1])*s, (z[0]-x[2])*s, (x[1]-y[0])*s, 0.25/s]
        elif (x[0]>y[1] and x[0]>z[2]):
            s = 2.0*sqrt(1.0+x[0]-y[1]-z[2])
            self.quaternion = [0.25*s, (y[0]+x[1])/s, (z[0]+x[2])/s, (y[2]-z[1])/s]
        elif (y[1]>z[2]):
            s = 2.0*sqrt(1.0+y[1]-x[0]-z[2])
            self.quaternion = [(y[0]+x[1])/s, 0.25*s, (z[1]+y[2])/s, (z[0]-x[2])/s]
        else:
            s = 2.0*sqrt(1.0+z[2]-x[0]-y[1])
            self.quaternion = [(z[0]+x[2])/s, (z[1]+y[2])/s, 0.25*s, (x[1]-y[0])/s]

    def vector_length(self, x):
        return sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2])

    def vector_divide_scalar(self, scalar, x):
        if (scalar!=0):
            x[0] = x[0]/scalar
            x[1] = x[1]/scalar
            x[2] = x[2]/scalar
        else: 
            x[0] = 0
            x[1] = 0
            x[2] = 0
        return x

    def normalize(self, x):
        return self.vector_divide_scalar(self.vector_length(x),x)

    def vector_cross(self, x, y): # x X y
        return [x[1]*y[2]-x[2]*y[1], x[2]*y[0]-x[0]*y[2], x[0]*y[1]-x[1]*y[0]]

    def look_at(self, eye, target):
        z = self.normalize([eye[0]-target[0], eye[1]-target[1], eye[2]-target[2]]) # eye - target

        if (self.vector_length(z)==0):
            z[2]=1
        x = self.normalize(self.vector_cross(self.up, z))

        if (self.vector_length(x)==0):
            z[0] += 0.0001
            x = self.normalize(self.vector_cross(self.up, z))

        y = self.vector_cross(z, x)
        m=[]
        m.extend(x)
        m.extend(y)
        m.extend(z)
        self.quaternion_from_rotation(m)
        

class ScaledObject(Object3d):
    """
    This object's matrix will be scaled every time the camera is adjusted, so that the object is always the same
    size in the viewport.

    The idea is that it is the parent for objects you want to maintain the same scale.
    """
    _view_name = Unicode('ScaledObjectView', sync=True)

class Controls(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _view_name = Unicode('ControlsView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('ControlsModel', sync=True)
    controlling = Instance(Object3d, sync=True, allow_none=True, **widget_serialization)

class OrbitControls(Controls):
    _view_name = Unicode('OrbitControlsView', sync=True)
    target = vector3(CFloat, sync=True)

class FlyControls(Controls):
    _view_name = Unicode('FlyControlsView', sync=True)

    forward_speed = Float(sync=True)
    lateral_speed = Float(sync=True)
    upward_speed = Float(sync=True)
    roll = Float(sync=True)
    pitch = Float(sync=True)
    yaw = Float(sync=True)

class Picker(Controls):
    _view_name  = Unicode('PickerView', sync=True)
    _model_name  = Unicode('PickerModel', sync=True)
    event = Unicode('click', sync=True)
    root = Instance(Object3d, sync=True, allow_none=True, **widget_serialization)
    picked = List(Dict, sync=True)
    distance = CFloat(sync=True)
    point = vector3(CFloat, sync=True)
    object = Instance(Object3d, sync=True, allow_none=True, **widget_serialization)
    face = vector3(CInt, sync=True)
    faceNormal = vector3(CFloat, sync=True)
    faceVertices = List(vector3(), sync=True)
    faceIndex = CInt(sync=True)
    all = Bool(False, sync=True)
    
class Geometry(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)    
    _view_name = Unicode('GeometryView', sync=True)

class PlainGeometry(Geometry):
    _view_name = Unicode('PlainGeometryView', sync=True)
    vertices = List(vector3(CFloat), sync=True)
    colors = List(Color, sync=True)
    faces = List(List(CFloat), sync=True)
    # todo: faceVertexUvs = List(vector3(vector2(CFloat)), sync=True)
    
class SphereGeometry(Geometry):
    _view_name = Unicode('SphereGeometryView', sync=True)
    radius = CFloat(1, sync=True)
    
class CylinderGeometry(Geometry):
    _view_name = Unicode('CylinderGeometryView', sync=True)
    radiusTop = CFloat(1, sync=True)
    radiusBottom = CFloat(1, sync=True)
    height = CFloat(1, sync=True)
    radiusSegments = CFloat(20, sync=True)
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
    thetaLength = CFloat(2*pi, sync=True)
    
class LatheGeometry(Geometry):
    _view_name = Unicode('LatheGeometryView', sync=True)
    points = List(vector3(), sync=True)
    segments = CInt(12, sync=True)
    phiStart = CFloat(0, sync=True)
    phiLength = CFloat(2*pi, sync=True)

class TubeGeometry(Geometry):
    _view_name = Unicode('TubeGeometryView', sync=True)
    path = List(vector3(), sync=True)
    segments = CInt(64, sync=True)
    radius = CFloat(1, sync=True)
    radialSegments = CFloat(8, sync=True)
    closed = Bool(False, sync=True)

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
    arc = CFloat(pi*2, sync=True)
    
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
    thetaLength = CFloat(pi*2, sync=True)

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
    facen = List(List(CInt), sync=True) # [[v0,v1,v2,...,vn], [v0,v1,v2,...,vn], [v0,v1,v2,...,vn], ...]

class ParametricGeometry(Geometry):
    _view_name = Unicode('ParametricGeometryView', sync=True)
    func = Unicode('', sync=True)
    slices = CInt(105, sync=True)
    stacks = CInt(105,sync=True)
    
class Material(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _view_name = Unicode('MaterialView', sync=True)
    # id = TODO
    name = Unicode('', sync=True) 
    side = Enum(['FrontSide', 'BackSide', 'DoubleSide'], 'DoubleSide',  sync=True) 
    opacity = CFloat(1.0, sync=True)
    transparent = Bool(False, sync=True)
    blending = Enum(['NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending', 'MultiplyBlending',
                    'CustomBlending'], 'NormalBlending', sync=True) 
    blendSrc = Enum(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor',
                    'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor'], 'SrcAlphaFactor', sync=True) 
    blendDst = Enum(['DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'], 'OneMinusDstColorFactor',
                    sync=True)
    blendEquation = Enum(['AddEquation', 'SubtractEquation', 'ReverseSubtractEquation'], 'AddEquation', sync=True)
    depthTest = Bool(True, sync=True) 
    depthWrite = Bool(True, sync=True) 
    polygonOffset = Bool(True, sync=True) 
    polygonOffsetFactor = CFloat(1.0, sync=True) 
    polygonOffsetUnits = CFloat(1.0, sync=True) 
    alphaTest = CFloat(1.0, sync=True) 
    overdraw = CFloat(1.0, sync=True) 
    visible = Bool(True, sync=True) 
    needsUpdate = Bool(True, sync=True) 
    
class BasicMaterial(Material):
    _view_name = Unicode('BasicMaterialView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('BasicMaterialModel', sync=True)
    color = Color('white', sync=True)
    wireframe = Bool(False, sync=True)
    wireframeLinewidth = CFloat(1.0, sync=True)
    wireframeLinecap = Unicode('round', sync=True)
    wireframeLinejoin = Unicode('round', sync=True)
    shading = Enum(['SmoothShading', 'FlatShading', 'NoShading'], 'SmoothShading', sync=True)
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)
    fog = Bool(False, sync=True)
    map = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
    lightMap = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
    specularMap = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
    envMap = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
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

class _LineMaterial(Material):
    """Abstract base class for line materials"""
    _view_name = None
    
class LineBasicMaterial(_LineMaterial):
    _view_name = Unicode('LineBasicMaterialView', sync=True)
    color = Color('white', sync=True)
    linewidth = CFloat(1.0, sync=True)
    linecap = Unicode('round', sync=True)
    linejoin = Unicode('round', sync=True)
    fog = Bool(False, sync=True) 
    vertexColors = Enum(['NoColors', 'FaceColors', 'VertexColors'], 'NoColors', sync=True)

class LineDashedMaterial(_LineMaterial):
    _view_name = Unicode('LineDashedMaterialView', sync=True)
    color = Color('white', sync=True)
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
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('ParticleSystemMaterialModel', sync=True)
    color = Color('yellow', sync=True)
    map = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
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

class SpriteMaterial(Material):
    _view_name = Unicode('SpriteMaterialView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('SpriteMaterialModel', sync=True)
    map = Instance(Texture, sync=True, allow_none=True, **widget_serialization)
    uvScale = List(CFloat, sync=True)
    sizeAttenuation = Bool(False, sync=True)
    color = Color('white', sync=True)
    uvOffset = List(CFloat, sync=True)
    fog = Bool(False, sync=True)
    useScreenCoordinates = Bool(False, sync=True)
    scaleByViewport = Bool(False, sync=True)
    alignment = List(CFloat, sync=True)

class Sprite(Object3d):
    _view_name = Unicode('SpriteView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('SpriteModel', sync=True)
    material = Instance(Material, sync=True, allow_none=True, **widget_serialization)
    scaleToTexture = Bool(False, sync=True)


class Mesh(Object3d):
    _view_name = Unicode('MeshView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('MeshModel', sync=True)
    geometry = Instance(Geometry, sync=True, **widget_serialization)
    material = Instance(Material, sync=True, **widget_serialization)

class Line(Mesh):
    # don't need a custom model since we aren't introducing new custom serialized properties,
    # just making the material property a more specific instance
    _view_name = Unicode('LineView', sync=True)
    type = Enum(['LineStrip', 'LinePieces'], 'LineStrip', sync=True)
    material = Instance(_LineMaterial, sync=True, **widget_serialization)
    
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
    
class Effect(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)

class AnaglyphEffect(Effect):
    _view_name = Unicode('AnaglyphEffectView', sync=True)

class Renderer(Widget):
    _view_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _view_name = Unicode('RendererView', sync=True)
    _model_module = Unicode('nbextensions/pythreejs/pythreejs', sync=True)
    _model_name = Unicode('RendererModel', sync=True)
    width = CInt(600, sync=True)
    height = CInt(400, sync=True)
    renderer_type = Enum(['webgl', 'canvas', 'auto'], 'auto', sync=True)
    scene = Instance(Scene, sync=True, **widget_serialization)
    camera = Instance(Camera, sync=True, **widget_serialization)
    controls = List(Instance(Controls), sync=True, **widget_serialization)
    effect = Instance(Effect, sync=True, allow_none=True, **widget_serialization)
    background = Color('black', sync=True, allow_none=True)

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

# Some helper classes and functions
def lights_color():
    return [
        AmbientLight(color=(0.312,0.188,0.4)),
        DirectionalLight(position=[1,0,1], color=[0.8, 0, 0]),
        DirectionalLight(position=[1,1,1], color=[0, 0.8, 0]),
        DirectionalLight(position=[0,1,1], color=[0, 0, 0.8]),
        DirectionalLight(position=[-1,-1,-1], color=[.9,.7,.9]),
    ]

def lights_gray():
    return [
        AmbientLight(color=[.6, .6, .6]),
        DirectionalLight(position=[0,1,1], color=[.5, .5, .5]),
        DirectionalLight(position=[0,0,1], color=[.5, .5, .5]),
        DirectionalLight(position=[1,1,1], color=[.5, .5, .5]),
        DirectionalLight(position=[-1,-1,-1], color=[.7,.7,.7]),
    ]

class SurfaceGrid(Mesh):
    """A grid covering a surface.

    This will draw a line mesh overlaying the SurfaceGeometry.
    """
    # don't need a custom model since we aren't introducing new custom serialized properties,
    # just making some properties more specific instances
    _view_name = Unicode('SurfaceGridView', sync=True)
    geometry = Instance(SurfaceGeometry, sync=True, **widget_serialization)
    material = Instance(_LineMaterial, sync=True, **widget_serialization)


def make_text(text, position=(0,0,0), height=1):
    """
    Return a text object at the specified location with a given height
    """
    sm = SpriteMaterial(map=TextTexture(string=text, color='white', size=100, squareTexture=False))
    return Sprite(material=sm, position = position, scaleToTexture=True, scale=[1,height,1])

def height_texture(z, colormap = 'YlGnBu_r'):
    """Create a texture corresponding to the heights in z and the given colormap."""
    from matplotlib import cm
    from skimage import img_as_ubyte
    import numpy as np
    
    colormap = cm.get_cmap(colormap)
    im = z.copy()
    # rescale to be in [0,1], scale nan to be the smallest value
    im -= np.nanmin(im)
    im /= np.nanmax(im)
    im = np.nan_to_num(im)

    import warnings
    with warnings.catch_warnings():
        # ignore the precision warning that comes from converting floats to uint8 types
        warnings.filterwarnings("ignore",
                                message="Possible precision loss when converting from",
                                category=UserWarning,
                                module="skimage.util.dtype",
                                lineno=107)
        rgba_im = img_as_ubyte(colormap(im)) # convert the values to rgba image using the colormap

    rgba_list = list(rgba_im.flat) # make a flat list

    return DataTexture(data=rgba_list, format='RGBAFormat', width=z.shape[1], height=z.shape[0])
