
from six import string_types

from ipywidgets import Widget, widget_serialization

def serialize_uniforms(uniforms, obj):

    serialized = {}

    for name, uniform in uniforms.items():
        value = uniform['value']

        if value is None:
            serialized[name] = { 'value': None }

        elif isinstance(value, Widget):
            serialized[name] = {
                'type': 't',
                'value': widget_serialization['to_json'](value, None)
            }

        elif isinstance(value, string_types):
            serialized[name] = {
                'type': 'c',
                'value': value
            }

        elif isinstance(value, (list, tuple)):
            serialized[name] = {
                'value': value
            }

            ll = len(value)
            if 2 <= ll <= 4:
                serialized[name]['type'] = 'v%d' % ll
            elif ll == 9:
                serialized[name]['type'] = 'm3'
            elif ll == 16:
                serialized[name]['type'] = 'm4'

        else:
            serialized[name] = {
                'value': value
            }

    return serialized



def deserialize_uniforms(serialized, obj):

    uniforms = {}

    for name, uniform in serialized.items():
        t = uniform['type']
        value = uniform['value']

        if t == 't':
            uniforms[name] = {'value': widget_serialization['from_json'](value, None)}

        else:
            uniforms[name].value = uniform.value

    return uniforms


uniforms_serialization = dict(
    to_json=serialize_uniforms,
    from_json=deserialize_uniforms
)
