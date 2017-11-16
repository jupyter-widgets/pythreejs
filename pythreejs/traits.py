#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import namedtuple, Sequence

from traitlets import (
    Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat,
    Bool, Tuple, Undefined, TraitError, Union, TraitType
)

from ipywidgets import widget_serialization

from ipydatawidgets import DataUnion, NDArrayWidget


def _castable_namedtuple(typename, field_names):
    base = namedtuple('%s_base' % typename, field_names)

    def new_new(cls, *args, **kwargs):
        if not kwargs and len(args) == 1 and isinstance(args, Sequence):
            return base.__new__(cls, *args[0], **kwargs)
        return base.__new__(cls, *args, **kwargs)

    return type(typename, (base,), {'__new__': new_new})


class Vector2(Tuple):
    """A trait for a 2-tuple corresponding to a three.js Vector2.
    """

    default_value = (0, 0)
    info_text = 'a two-element vector'

    def __init__(self, trait=CFloat, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Vector2, self).__init__(*(trait, trait), default_value=default_value, **kwargs)


class Vector3(Tuple):
    """A trait for a 3-tuple corresponding to a three.js Vector3.
    """

    default_value = (0, 0, 0)
    info_text = 'a three-element vector'

    def __init__(self, trait=CFloat, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Vector3, self).__init__(*(trait, trait, trait), default_value=default_value, **kwargs)


class Vector4(Tuple):
    """A trait for a 4-tuple corresponding to a three.js Vector4.
    """

    default_value = (0, 0, 0, 0)
    info_text = 'a four-element vector'

    def __init__(self, trait=CFloat, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Vector4, self).__init__(*(trait, trait, trait, trait), default_value=default_value, **kwargs)


class Matrix3(Tuple):
    """A trait for a 9-tuple corresponding to a three.js Matrix3.
    """

    default_value = (
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    info_text = 'a three-by-three matrix (9 element tuple)'

    def __init__(self, trait=CFloat, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Matrix3, self).__init__(*((trait,) * 9), default_value=default_value, **kwargs)


class Matrix4(Tuple):
    """A trait for a 16-tuple corresponding to a three.js Matrix4.
    """

    default_value = (
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    info_text = 'a four-by-four matrix (16 element tuple)'

    def __init__(self, trait=CFloat, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Matrix4, self).__init__(*((trait,) * 16), default_value=default_value, **kwargs)


class Face3(Tuple):
    """A trait for a named tuple corresponding to a three.js Face3.

    Accepts named tuples with the field names:
    ('a', 'b', 'c', 'normal', 'color', 'materialIndex')
    """
    klass = _castable_namedtuple('Face3', ('a', 'b', 'c', 'normal', 'color', 'materialIndex'))
    _cast_types = (list, tuple)

    info_text = 'a named tuple representing a Face3'

    def __init__(self, **kwargs):
        super(Face3, self).__init__(
            CInt(),     # a - Vertex A index.
            CInt(),     # b - Vertex B index.
            CInt(),     # c - Vertex C index.
            Union([     # normal - (optional) Face normal (Vector3) or array of 3 vertex normals.
                Vector3(allow_none=True),
                Tuple((Vector3(),) * 3),
            ]),
            Union([     # color - (optional) Face color or array of vertex colors.
                Unicode(allow_none=True),
                Tuple((Unicode(),) * 3),
            ]),
            CInt(allow_none=True),     # materialIndex - (optional) which index of an array of materials to associate with the face.
            default_value=(0, 0, 0, None, None, None)
        )


class Euler(Tuple):
    """A trait for a set of Euler angles.

    Expressed as a tuple of tree floats (the angles), and the order as a string.
    See the three.js docs for futher details.
    """

    info_text = 'a set of Euler angles'
    default_value = (0, 0, 0, 'XYZ')

    _accepted_orders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX']

    def __init__(self, default_value=Undefined, **kwargs):
        if default_value is Undefined:
            default_value = self.default_value
        super(Euler, self).__init__(
            CFloat(), CFloat(), CFloat(),
            Enum(self._accepted_orders, self._accepted_orders[0]),
            default_value=default_value , **kwargs)


class WebGLDataUnion(DataUnion):
    """A trait that accepts either a numpy array, or an NDArrayWidget reference.

    Also constrains the use of 64-bit arrays, as this is not supported by WebGL.
    """
    def validate(self, obj, value):
        value = super(WebGLDataUnion, self).validate(obj, value)
        array = value.array if isinstance(value, NDArrayWidget) else value

        if array is not Undefined and str(array.dtype) == 'float64':
            if isinstance(value, NDArrayWidget):
                raise TraitError('Cannot use a float64 data widget as a BufferAttribute source.')
            else:
                # 64-bit not supported, coerce to 32-bit
                value = value.astype('float32')
        return value


class Uninitialized:
    """Placeholder sentinel used while waiting for a initialization via sync"""
    pass

_widget_to_json = widget_serialization['to_json']

def _serialize_uninitialized(value, owner):
    if isinstance(value, Uninitialized):
        return 'uninitialized'
    return _widget_to_json(value, owner)

unitialized_serialization = {
    'to_json': _serialize_uninitialized,
    'from_json': widget_serialization['from_json'],
    }

UninitializedSentinel = Uninitialized()
