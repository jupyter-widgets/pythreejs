r"""
ipywidget wrapper for three.js extras classes
"""

from ipywidgets import Widget, DOMWidget, widget_serialization, Color
from traitlets import (Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool)
from ._package import npm_pkg_name

from math import pi, sqrt

from .traits import vector2, vector3
from .core import Geometry


class SphereGeometry(Geometry):
    _view_name = Unicode('SphereGeometryView').tag(sync=True)
    _model_name = Unicode('SphereGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)


class CylinderGeometry(Geometry):
    _view_name = Unicode('CylinderGeometryView').tag(sync=True)
    _model_name = Unicode('CylinderGeometryModel').tag(sync=True)

    radiusTop = CFloat(1).tag(sync=True)
    radiusBottom = CFloat(1).tag(sync=True)
    height = CFloat(1).tag(sync=True)
    radiusSegments = CFloat(20).tag(sync=True)
    heightSegments = CFloat(1).tag(sync=True)
    openEnded = Bool().tag(sync=True)


class BoxGeometry(Geometry):
    _view_name = Unicode('BoxGeometryView').tag(sync=True)
    _model_name = Unicode('BoxGeometryModel').tag(sync=True)

    width = CFloat(1).tag(sync=True)
    height = CFloat(1).tag(sync=True)
    depth = CFloat(1).tag(sync=True)
    widthSegments = CFloat(1).tag(sync=True)
    heightSegments = CFloat(1).tag(sync=True)
    depthSegments = CFloat(1).tag(sync=True)


class CircleGeometry(Geometry):
    _view_name = Unicode('CircleGeometryView').tag(sync=True)
    _model_name = Unicode('CircleGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    segments = CFloat(8).tag(sync=True)
    thetaStart = CFloat(0).tag(sync=True)
    thetaLength = CFloat(2 * pi).tag(sync=True)


class LatheGeometry(Geometry):
    _view_name = Unicode('LatheGeometryView').tag(sync=True)
    _model_name = Unicode('LatheGeometryModel').tag(sync=True)

    points = List(vector3()).tag(sync=True)
    segments = CInt(12).tag(sync=True)
    phiStart = CFloat(0).tag(sync=True)
    phiLength = CFloat(2 * pi).tag(sync=True)


class TubeGeometry(Geometry):
    _view_name = Unicode('TubeGeometryView').tag(sync=True)
    _model_name = Unicode('TubeGeometryModel').tag(sync=True)

    path = List(vector3()).tag(sync=True)
    segments = CInt(64).tag(sync=True)
    radius = CFloat(1).tag(sync=True)
    radialSegments = CFloat(8).tag(sync=True)
    closed = Bool().tag(sync=True)


class IcosahedronGeometry(Geometry):
    _view_name = Unicode('IcosahedronGeometryView').tag(sync=True)
    _model_name = Unicode('IcosahedronGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    detail = CFloat(0).tag(sync=True)


class OctahedronGeometry(Geometry):
    _view_name = Unicode('OctahedronGeometryView').tag(sync=True)
    _model_name = Unicode('OctahedronGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    detail = CFloat(0).tag(sync=True)


class PlaneGeometry(Geometry):
    _view_name = Unicode('PlaneGeometryView').tag(sync=True)
    _model_name = Unicode('PlaneGeometryModel').tag(sync=True)

    width = CFloat(1).tag(sync=True)
    height = CFloat(1).tag(sync=True)
    widthSegments = CFloat(1).tag(sync=True)
    heightSegments = CFloat(1).tag(sync=True)


class TetrahedronGeometry(Geometry):
    _view_name = Unicode('TetrahedronGeometryView').tag(sync=True)
    _model_name = Unicode('TetrahedronGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    detail = CFloat(0).tag(sync=True)


class TorusGeometry(Geometry):
    _view_name = Unicode('TorusGeometryView').tag(sync=True)
    _model_name = Unicode('TorusGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    tube = CFloat(1).tag(sync=True)
    radialSegments = CFloat(1).tag(sync=True)
    tubularSegments = CFloat(1).tag(sync=True)
    arc = CFloat(pi * 2).tag(sync=True)


class TorusKnotGeometry(Geometry):
    _view_name = Unicode('TorusKnotGeometryView').tag(sync=True)
    _model_name = Unicode('TorusKnotGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    tube = CFloat(1).tag(sync=True)
    radialSegments = CFloat(10).tag(sync=True)
    tubularSegments = CFloat(10).tag(sync=True)
    p = CFloat(2).tag(sync=True)
    q = CFloat(3).tag(sync=True)
    heightScale = CFloat(1).tag(sync=True)


class PolyhedronGeometry(Geometry):
    _view_name = Unicode('PolyhedronGeometryView').tag(sync=True)
    _model_name = Unicode('PolyhedronGeometryModel').tag(sync=True)

    radius = CFloat(1).tag(sync=True)
    detail = CInt(0).tag(sync=True)
    vertices = List(List(CFloat)).tag(sync=True)
    faces = List(List(CInt)).tag(sync=True)


class RingGeometry(Geometry):
    _view_name = Unicode('RingGeometryView').tag(sync=True)
    _model_name = Unicode('RingGeometryModel').tag(sync=True)

    innerRadius = CFloat(1.0).tag(sync=True)
    outerRadius = CFloat(3.0).tag(sync=True)
    thetaSegments = CInt(8).tag(sync=True)
    phiSegments = CInt(8).tag(sync=True)
    thetaStart = CFloat(0).tag(sync=True)
    thetaLength = CFloat(pi * 2).tag(sync=True)


