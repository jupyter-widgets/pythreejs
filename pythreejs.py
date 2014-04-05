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

class ScaledObject(Object3d):
    """
    This object's matrix will be scaled every time the camera is adjusted, so that the object is always the same
    size in the viewport.

    The idea is that it is the parent for objects you want to maintain the same scale.
    """
    _view_name = Unicode('ScaledObjectView', sync=True)

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
    thetaLength = CFloat(2*math.pi, sync=True)
    
class LatheGeometry(Geometry):
    _view_name = Unicode('LatheGeometryView', sync=True)
    points = List(vector3(), sync=True)
    segments = CInt(12, sync=True)
    phiStart = CFloat(0, sync=True)
    phiLength = CFloat(2*math.pi, sync=True)

class TubeGeometry(Geometry):
    _view_name = Unicode('LatheGeometryView', sync=True)
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
    facen = List(List(CInt), sync=True) # [[v0,v1,v2,...,vn], [v0,v1,v2,...,vn], [v0,v1,v2,...,vn], ...]

class ParametricGeometry(Geometry):
    _view_name = Unicode('ParametricGeometryView', sync=True)
    func = Unicode('', sync=True)
    slices = CInt(105, sync=True)
    stacks = CInt(105,sync=True)
    
class Material(Widget):
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

class SpriteMaterial(Material):
    _view_name = Unicode('SpriteMaterialView', sync=True)
    map = Instance(Texture, sync=True)
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
    material = Instance(Material, sync=True)
    scaleToTexture = Bool(False, sync=True)

class TextTexture(Texture):
    _view_name = Unicode('TextTextureView', sync=True)
    fontFace = Unicode('Arial', sync=True)
    size = CInt(12, sync=True)
    color = Color('black', sync=True)
    string = Unicode('', sync=True)
    squareTexture = Bool(True, sync=True)

class Mesh(Object3d):
    _view_name = Unicode('MeshView', sync=True)
    geometry = Instance(Geometry, sync=True)
    material = Instance(Material, sync=True)

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
    pass

class AnaglyphEffect(Effect):
    _view_name = Unicode('AnaglyphEffectView', sync=True)

class Renderer(DOMWidget):
    _view_name = Unicode('RendererView', sync=True)
    width = CInt(600, sync=True)
    height = CInt(400, sync=True)
    renderer_type = Enum(['webgl', 'canvas', 'auto'], 'auto', sync=True)
    scene = Instance(Scene, sync=True)
    camera = Instance(Camera, sync=True)
    controls = Instance(Controls, sync=True)
    effect = Instance(Effect, sync=True)
    color = Color('black', sync=True)

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


# TODO material type option

def create_from_plot(plot):
    tree = plot.scenetree_json()
    obj = sage_handlers[tree['type']](tree)
    cam = PerspectiveCamera(position=[10,10,10], fov=40, up=[0,0,1],
           children=[DirectionalLight(color=0xffffff, position=[3,5,1], intensity=0.5)])
    scene = Scene(children=[obj, AmbientLight(color=0x777777)])
    renderer = Renderer(camera=cam, scene=scene, controls=OrbitControls(controlling=cam), color='white')
    return renderer

def json_object(t):
    # TODO make material depend on object type
    if (t['geometry']['type']=='text'):
        mesh = sage_handlers['text'](t)
    elif (t['geometry']['type']=='point'):
        mesh = sage_handlers['point'](t)
    elif (t['geometry']['type']=='line'):
        mesh = sage_handlers['line'](t)
    else:
        m = sage_handlers['texture'](t['texture'])
        g = sage_handlers[t['geometry']['type']](t['geometry'])
        mesh = Mesh(geometry=g, material=m)
        if t.get('mesh',False) is True:
            wireframe_material = BasicMaterial(color=0x222222, transparent=True, opacity=0.2, wireframe=True)
            mesh = Object3d(children=[mesh, Mesh(geometry=g, material=wireframe_material)])
    if t['geometry']['type'] in ('cone', 'cylinder'):
        # Sage assumes the base is on the xy plane and the cylinder axis is parallel to the z-axis
        m = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, t['geometry']['height']/2, 1]
        mesh = Object3d(matrix=m, children=[mesh])
    return mesh

def json_group(t):
    m = t.get('matrix', [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])
    # three.js transformation matrices are the transpose of sage transformations
    m[1], m[2], m[3], m[4], m[6], m[7], m[8], m[9],m[11],m[12],m[13],m[14] = \
    m[4], m[8],m[12], m[1], m[9],m[13], m[2], m[6],m[14], m[3], m[7],m[11]
    children = [sage_handlers[c['type']](c) for c in t['children']]
    return Object3d(matrix=m, children=children)

def json_texture(t):
    return PhongMaterial(side='DoubleSide',
                         color = t['color'],
                         opacity = t['opacity'],
                         transparent = t['opacity'] < 1,
                         overdraw=1,
                         polygonOffset=True,
                         polygonOffsetFactor=1,
                         polygonOffsetUnits=1)

def json_box(t):
    return BoxGeometry(width=t['size'][0], 
                        height=t['size'][1], 
                        depth=t['size'][2])

def json_index_face_set(t):
    from itertools import chain
    def flatten(ll):
        return list(chain.from_iterable(ll))
    return FaceGeometry(vertices = flatten(t['vertices']),
                         face3 = flatten(t['face3']),
                         face4 = flatten(t['face4']),
                         facen = t['facen'])

def json_cone(t):
    return CylinderGeometry(radiusTop=0,
                             radiusBottom=t['bottomradius'],
                             height=t['height'],
                             radiusSegments=50)

def json_cylinder(t):
    return CylinderGeometry(radiusTop=t['radius'],
                             radiusBottom=t['radius'],
                             height=t['height'])

def json_sphere(t):
    return SphereGeometry(radius=t['radius'])

def json_line(t):
    tree_geometry = t['geometry']
    m = sage_handlers['texture'](t['texture'])
    mesh = []
    length = len(tree_geometry['points'])
    rotate = [0,0,0]
    midpoint = [0,0,0]
    distance = 0
    for p in range(length):
        g = SphereGeometry(radius=tree_geometry['thickness'])
        mesh.append(Mesh(geometry=g, 
                            material=m, 
                            scale=[.02,.02,.02], 
                            position=list(tree_geometry['points'][p])))
        if (p < length-1):
            for i in range(3):
                rotate[i] = tree_geometry['points'][p][i]-tree_geometry['points'][p+1][i]
                midpoint[i] = (tree_geometry['points'][p][i]+tree_geometry['points'][p+1][i])/2
            distance = (rotate[0]*rotate[0]+rotate[1]*rotate[1]+rotate[2]*rotate[2])**.5
            g = CylinderGeometry(radiusTop=tree_geometry['thickness'],
                                 radiusBottom=tree_geometry['thickness'],
                                 height=distance)
            mesh.append(Mesh(geometry=g, 
                                material=m, 
                                position=midpoint,
                                scale=[.02,1,.02],
                                rotation=rotate))
    return Object3d(children=mesh)

def json_text(t):
    tree_geometry = t['geometry']
    tree_texture = t['texture']
    tt = TextTexture(string=tree_geometry['string'])
    sm = SpriteMaterial(map=tt, opacity=tree_texture['opacity'], transparent = tree_texture['opacity'] < 1 )
    return Sprite(material=sm, scaleToTexture=True)

def json_point(t):
    g = SphereGeometry(radius=t['geometry']['size'])
    m = sage_handlers['texture'](t['texture'])
    myobject = Mesh(geometry=g, material=m, scale=[.02,.02,.02])
    return ScaledObject(children=[myobject], position = list(t['geometry']['position']))

sage_handlers = {'object' : json_object,
             'group' : json_group,
             'box' : json_box,
             'sphere' : json_sphere,
             'index_face_set' : json_index_face_set,
             'cone' : json_cone,
             'cylinder' : json_cylinder,
             'texture' : json_texture,
             'line' : json_line,
             'text' : json_text,
             'point' : json_point
            }
