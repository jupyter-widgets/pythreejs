#!/usr/bin/env python
# -*- coding: utf-8 -*-

from collections import namedtuple
from collections.abc import Sequence
import numbers
import math
import re
import warnings

from traitlets import (
    Unicode, Int, CInt, Instance, Enum, List, Dict, Float, CFloat,
    Bool, Tuple, Undefined, TraitError, Union, TraitType, CaselessStrEnum
)

from ipywidgets import widget_serialization

from ipydatawidgets import DataUnion, NDArrayWidget, shape_constraints

import numpy as np


def _castable_namedtuple(typename, field_names):
    base = namedtuple('%s_base' % typename, field_names)

    def new_new(cls, *args, **kwargs):
        if not kwargs and len(args) == 1 and isinstance(args, Sequence):
            return base.__new__(cls, *args[0], **kwargs)
        return base.__new__(cls, *args, **kwargs)

    return type(typename, (base,), {'__new__': new_new})


def _ieee_to_json(value, owner):
    if isinstance(value, numbers.Real):
        # cast out-of-range floats to their reprs
        if math.isnan(value) or math.isinf(value):
            return repr(value)
    return value

ieee_float_serializers = {
    'to_json': _ieee_to_json,
}


class IEEEFloat(CFloat):
    def __init__(self, default_value=Undefined, **kwargs):
        super().__init__(default_value=default_value, **kwargs)
        self.metadata.setdefault("to_json", _ieee_to_json)


def _ieee_tuple_to_json(value, owner):
    if value is None:
        return value
    return [_ieee_to_json(e, owner) for e in value]


class Vector2(Tuple):
    """A trait for a 2-tuple corresponding to a three.js Vector2.
    """

    default_value = (0, 0)
    info_text = 'a two-element vector'

    def __init__(self, trait=Undefined, default_value=Undefined, **kwargs):
        if trait is Undefined:
            trait = IEEEFloat()
        if default_value is Undefined:
            default_value = self.default_value
        else:
            self.default_value = default_value
        super(Vector2, self).__init__(*(trait, trait), default_value=default_value, **kwargs)
        if isinstance(trait, IEEEFloat):
            self.metadata.setdefault("to_json", _ieee_tuple_to_json)


class Vector3(Tuple):
    """A trait for a 3-tuple corresponding to a three.js Vector3.
    """

    default_value = (0, 0, 0)
    info_text = 'a three-element vector'

    def __init__(self, trait=Undefined, default_value=Undefined, **kwargs):
        if trait is Undefined:
            trait = IEEEFloat()
        if default_value is Undefined:
            default_value = self.default_value
        else:
            self.default_value = default_value
        super(Vector3, self).__init__(*(trait, trait, trait), default_value=default_value, **kwargs)
        if isinstance(trait, IEEEFloat):
            self.metadata.setdefault("to_json", _ieee_tuple_to_json)


class Vector4(Tuple):
    """A trait for a 4-tuple corresponding to a three.js Vector4.
    """

    default_value = (0, 0, 0, 0)
    info_text = 'a four-element vector'

    def __init__(self, trait=Undefined, default_value=Undefined, **kwargs):
        if trait is Undefined:
            trait = IEEEFloat()
        if default_value is Undefined:
            default_value = self.default_value
        else:
            self.default_value = default_value
        super(Vector4, self).__init__(*(trait, trait, trait, trait), default_value=default_value, **kwargs)
        if isinstance(trait, IEEEFloat):
            self.metadata.setdefault("to_json", _ieee_tuple_to_json)


class Matrix3(Tuple):
    """A trait for a 9-tuple corresponding to a three.js Matrix3.
    """

    default_value = (
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
    info_text = 'a three-by-three matrix (9 element tuple)'

    def __init__(self, trait=Undefined, default_value=Undefined, **kwargs):
        if trait is Undefined:
            trait = IEEEFloat()
        if default_value is Undefined:
            default_value = self.default_value
        else:
            self.default_value = default_value
        super(Matrix3, self).__init__(*((trait,) * 9), default_value=default_value, **kwargs)
        if isinstance(trait, IEEEFloat):
            self.metadata.setdefault("to_json", _ieee_tuple_to_json)


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

    def __init__(self, trait=Undefined, default_value=Undefined, **kwargs):
        if trait is Undefined:
            trait = IEEEFloat()
        if default_value is Undefined:
            default_value = self.default_value
        else:
            self.default_value = default_value
        super(Matrix4, self).__init__(*((trait,) * 16), default_value=default_value, **kwargs)
        if isinstance(trait, IEEEFloat):
            self.metadata.setdefault("to_json", _ieee_tuple_to_json)


def _face_to_json(value, owner):
    if value is None:
        return None
    value = list(value)
    if value[3] is not None:
        normal = list(value[3])
        for i, v in enumerate(normal):
            if isinstance(v, tuple):
                normal[i] = _ieee_tuple_to_json(v, owner)
            else:
                normal[i] = _ieee_to_json(v, owner)
        value[3] = normal
    return value


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
        self.metadata.setdefault("to_json", _face_to_json)


def _euler_to_json(value, owner):
    if value is None:
        return None
    return _ieee_tuple_to_json(value[:3], owner) + [value[3]]

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
        else:
            self.default_value = default_value
        super(Euler, self).__init__(
            IEEEFloat(), IEEEFloat(), IEEEFloat(),
            Enum(self._accepted_orders, self._accepted_orders[0]),
            default_value=default_value , **kwargs)
        self.metadata.setdefault("to_json", _euler_to_json)


class WebGLDataUnion(DataUnion):
    """A trait that accepts either a numpy array, or an NDArrayWidget reference.

    Also constrains the use of 64-bit arrays, as this is not supported by WebGL.
    """
    def validate(self, obj, value):
        was_original_array = isinstance(value, np.ndarray)
        value = super(WebGLDataUnion, self).validate(obj, value)
        array = value.array if isinstance(value, NDArrayWidget) else value

        dtype_str = str(array.dtype) if array is not Undefined else ''
        if dtype_str == 'float64' or dtype_str.endswith('int64'):
            if isinstance(value, NDArrayWidget):
                raise TraitError(
                    'Cannot use a %s data widget as a WebGL source.' %
                    (dtype_str,))
            else:
                # 64-bit not supported, coerce to 32-bit
                # If original was another array, warn about casting,
                # as it might otherwise silently increase memory usage:
                if was_original_array:
                    warnings.warn('64-bit data types not supported for WebGL '
                                  'data, casting to 32-bit.')
                value = value.astype(dtype_str.replace('64', '32'))
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


# Color trait. In process of being upstreamed to ipywidgets

_color_names = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred ', 'indigo ', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen']
_color_re = re.compile(r'#[a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?$')

_color_hexa_re = re.compile(r'^#[a-fA-F0-9]{4}(?:[a-fA-F0-9]{4})?$')

_color_frac_percent = r'\s*(\d+(\.\d*)?|\.\d+)?%?\s*'
_color_int_percent = r'\s*\d+%?\s*'

_color_rgb = r'rgb\({ip},{ip},{ip}\)'
_color_rgba = r'rgba\({ip},{ip},{ip},{fp}\)'
_color_hsl = r'hsl\({fp},{fp},{fp}\)'
_color_hsla = r'hsla\({fp},{fp},{fp},{fp}\)'

_color_rgbhsl_re = re.compile('({0})|({1})|({2})|({3})'.format(
    _color_rgb, _color_rgba, _color_hsl, _color_hsla
).format(ip=_color_int_percent, fp=_color_frac_percent))


class Color(Unicode):
    """A string holding a valid HTML color such as 'blue', '#060482', '#A80'"""

    info_text = 'a valid HTML color'
    default_value = Undefined

    def validate(self, obj, value):
        if value is None and self.allow_none:
            return value
        if isinstance(value, str):
            if value.lower() in _color_names or _color_re.match(value):
                return value
            elif _color_hexa_re.match(value) or _color_rgbhsl_re.match(value):
                return value
        self.error(obj, value)


class Uniform(Dict):
    """A dict holding uniforms for a ShaderMaterial"""

    def __init__(self, default_value=Undefined, **kwargs):
        super(Uniform, self).__init__(per_key_traits=dict(
            value=Union((
                Int(), IEEEFloat(), Color(), Instance('pythreejs.Texture'),
                List(trait=Union((
                    Int(), IEEEFloat(), Color(), Instance('pythreejs.Texture')))),
            ), allow_none=True),
            type=Unicode()
        ), default_value=default_value, **kwargs)
