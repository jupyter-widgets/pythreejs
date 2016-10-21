
from traitlets import Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat, Bool, Tuple

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

def Face3(**kwargs):
    return Tuple(CInt(), CInt(), CInt(), Vector3(), Unicode(), CInt(), Tuple(), Tuple())

def BufferAttribute(trait_type=CFloat, **kwargs):
    return Tuple(
        List(allow_none=True),      # 0. array
        CInt(allow_none=False),     # 1. itemSize
        Bool(default_value=False),  # 2. dynamic
        Unicode(),                  # 3. uuid
        CInt(),                     # 6. version
        default_value=(None, -1, False, "", -1)
    )