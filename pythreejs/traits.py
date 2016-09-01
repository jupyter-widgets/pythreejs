
from traitlets import Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool

def Vector2(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [0, 0]
    return List(trait_type, default_value=default, minlen=2, maxlen=2, **kwargs)

def Vector3(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [0, 0, 0]
    return List(trait_type, default_value=default, minlen=3, maxlen=3, **kwargs)

def Vector4(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [0, 0, 0, 0]
    return List(trait_type, default_value=default, minlen=4, maxlen=4, **kwargs)

def Matrix3(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]
    return List(trait_type, default_value=default, minlen=9, maxlen=9, **kwargs)

def Matrix4(trait_type=CFloat, default=None, **kwargs):
    if default is None:
        default = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    return List(trait_type, default_value=default, minlen=16, maxlen=16, **kwargs)



