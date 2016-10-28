from .._base.Three import ThreeWidget
from .Object3D_autogen import Object3D as Object3DBase

class Object3D(Object3DBase):
    
    def add(self, child):
        children_list = list(self.children)
        children_list.append(child)

        self.children = tuple(children_list)
        child.parent = self

    def remove(self, child):
        pass

    def lookAt(self, vector):
        self.exec_three_obj_method('lookAt', vector)
    
    def rotateX(self, rad):
        self.exec_three_obj_method('rotateX', rad)


