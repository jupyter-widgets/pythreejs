r"""
ipywidget wrappers for three.js "Core" classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from .traits import vector2, vector3

class Object3d(Widget):
    """
    If matrix is not None, it overrides the position, rotation, scale, and up variables.
    """
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('Object3dView').tag(sync=True)
    _model_name = Unicode('Object3dModel').tag(sync=True)

    position = vector3(CFloat).tag(sync=True)
    quaternion = List(CFloat).tag(sync=True)  # [x,y,z,w]
    scale = vector3(CFloat, [1, 1, 1]).tag(sync=True)
    up = vector3(CFloat, [0, 1, 0]).tag(sync=True)
    visible = Bool(True).tag(sync=True)
    castShadow = Bool().tag(sync=True)
    receiveShadow = Bool().tag(sync=True)

    # This matrix has the translation in the 4th row, which is is the
    # transpose of Sage's transformation matrices
    # TODO: figure out how to get a list of instances of Object3d
    children = List().tag(sync=True, **widget_serialization)

    def set_matrix(self, m):
        self.position = m[12:15]
        x = m[0:3]
        y = m[4:7]
        z = m[8:11]
        self.scale = [self.vector_length(x),
                      self.vector_length(y),
                      self.vector_length(z)]
        m = []
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
        trace = x[0] + y[1] + z[2]
        if (trace > 0):
            s = 0.5 / sqrt(trace + 1)
            self.quaternion = [(y[2] - z[1]) * s, (z[0] - x[2]) * s, (x[1] - y[0]) * s, 0.25 / s]
        elif (x[0] > y[1] and x[0] > z[2]):
            s = 2.0 * sqrt(1.0 + x[0] - y[1] - z[2])
            self.quaternion = [0.25 * s, (y[0] + x[1]) / s, (z[0] + x[2]) / s, (y[2] - z[1]) / s]
        elif (y[1] > z[2]):
            s = 2.0 * sqrt(1.0 + y[1] - x[0] - z[2])
            self.quaternion = [(y[0] + x[1]) / s, 0.25 * s, (z[1] + y[2]) / s, (z[0] - x[2]) / s]
        else:
            s = 2.0 * sqrt(1.0 + z[2] - x[0] - y[1])
            self.quaternion = [(z[0] + x[2]) / s, (z[1] + y[2]) / s, 0.25 * s, (x[1] - y[0]) / s]

    def vector_length(self, x):
        return sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2])

    def vector_divide_scalar(self, scalar, x):
        if (scalar != 0):
            x[0] = x[0] / scalar
            x[1] = x[1] / scalar
            x[2] = x[2] / scalar
        else:
            x[0] = 0
            x[1] = 0
            x[2] = 0
        return x

    def normalize(self, x):
        return self.vector_divide_scalar(self.vector_length(x),x)

    def vector_cross(self, x, y):  # x X y
        return [x[1] * y[2] - x[2] * y[1],
                x[2] * y[0] - x[0] * y[2],
                x[0] * y[1] - x[1] * y[0]]

    def look_at(self, eye, target):
        z = self.normalize([eye[0] - target[0],
                            eye[1] - target[1],
                            eye[2] - target[2]])  # eye - target

        if (self.vector_length(z) == 0):
            z[2] = 1
        x = self.normalize(self.vector_cross(self.up, z))

        if (self.vector_length(x) == 0):
            z[0] += 0.0001
            x = self.normalize(self.vector_cross(self.up, z))

        y = self.vector_cross(z, x)
        m = []
        m.extend(x)
        m.extend(y)
        m.extend(z)
        self.quaternion_from_rotation(m)


class ScaledObject(Object3d):
    """
    This object's matrix will be scaled every time the camera is adjusted, so
    that the object is always the same size in the viewport.

    The idea is that it is the parent for objects you want to maintain the same scale.
    """
    _view_name = Unicode('ScaledObjectView').tag(sync=True)
    _model_name = Unicode('ScaledObjectModel').tag(sync=True)


class Geometry(Widget):
    _view_module = Unicode(npm_pkg_name).tag(sync=True)
    _model_module = Unicode(npm_pkg_name).tag(sync=True)
    _view_name = Unicode('GeometryView').tag(sync=True)
    _model_name = Unicode('GeometryModel').tag(sync=True)


class PlainGeometry(Geometry):
    _view_name = Unicode('PlainGeometryView').tag(sync=True)
    _model_name = Unicode('PlainGeometryModel').tag(sync=True)

    vertices = List(vector3(CFloat)).tag(sync=True)
    colors = List(Color).tag(sync=True)
    faces = List(List(CFloat)).tag(sync=True)
    # todo: faceVertexUvs = List(vector3(vector2(CFloat))).tag(sync=True)


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


class ParametricGeometry(Geometry):
    _view_name = Unicode('ParametricGeometryView').tag(sync=True)
    _model_name = Unicode('ParametricGeometryModel').tag(sync=True)

    func = Unicode(sync=True)
    slices = CInt(105).tag(sync=True)
    stacks = CInt(105).tag(sync=True)

