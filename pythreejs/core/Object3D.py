from ipywidgets import register

from .._base.Three import ThreeWidget
from .Object3D_autogen import Object3D as Object3DBase


@register
class Object3D(Object3DBase):

    def add(self, children):
        if isinstance(children, Object3D):
            children = [children]
        children_list = list(self.children)
        children_list.extend(children)

        self.children = tuple(children_list)

    def remove(self, children):
        if isinstance(children, Object3D):
            children = [children]
        children_list = list(self.children)
        for child in children:
            children_list.remove(child)

        self.children = tuple(children_list)

    def lookAt(self, vector):
        self.exec_three_obj_method('lookAt', vector)

    def rotateX(self, rad):
        self.exec_three_obj_method('rotateX', rad)

    def _repr_keys(self):
        # Don't include aggregate structures in repr
        super_keys = super(Object3D, self)._repr_keys()
        for key in super_keys:
            if key not in ['matrix', 'matrixWorld', 'normalMatrix', 'matrixWorldInverse', 'modelViewMatrix']:
                yield key
