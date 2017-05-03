# -*- coding: utf-8 -*-
"""
Tests for Points and Related Objects
======================================
"""
from unittest import TestCase
from pythreejs.pythreejs import (BufferGeometry, Points, PointsMaterial, Scene,
                                 PerspectiveCamera, TrackballControls, Renderer)


class TestPoints(TestCase):
    """
    Test Python object behavior of :class:`~pythreejs.pythreejs.Points` and
    :class:`~pythreejs.pythreejs.PointsMaterial`.
    """
    def setUp(self):
        pass
        #self.vertices = [0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5]
        #geometry = BufferGeometry(vertices=self.vertices)
        #material = PointsMaterial(size=20.0)
        #points = Points(geometry, material)
        #camera = PerspectiveCamera(position=[2, 2, 2], up=[0, 0, 1])
        #controls = TrackballControls(controlling=camera, target=[0, 0, 0])
        #scene = Scene(children=[points])
        #self.renderer = Renderer(camera=camera, scene=scene, controls=[controls])

    def test_points(self):
        pass
        #pts = self.renderer.scene.children[0]
        #geom = pts.geometry
        #mat = pts.material
        #self.assertIsInstance(pts, Points)
        #self.assertIsInstance(geom, BufferGeometry)
        #self.assertIsInstance(mat, PointsMaterial)
        #self.assertTrue(geom.vertices == self.vertices)
