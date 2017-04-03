"""
Simple serialization for numpy arrays
"""

import numpy as np
from traitlets import Instance, TraitError, TraitType, Undefined

# Format:
# {'dtype': string, 'shape': tuple, 'array': memoryview}

def array_to_json(value, widget):
    return {
        'shape': value.shape,
        'dtype': str(value.dtype),
        'buffer': memoryview(value) # maybe should do array.tobytes(order='C') to copy
    }

def array_from_json(value, widget):
    # may need to copy the array if the underlying buffer is readonly
    n = np.frombuffer(value['buffer'], dtype=value['dtype'])
    n.shape = value['shape']
    return n

array_serialization = dict(to_json=array_to_json, from_json=array_from_json)

def shape_constraints(*args):
    """Example: shape_constraints(None,3) insists that the shape looks like (*,3)"""
    def validator(trait, value):
        if trait.allow_none:
            print(value)
        if len(value.shape) != len(args):
            raise TraitError('%s shape expected to have %s components, but got %s components'%(trait.name, len(args), (value, type(value))))
        for i, constraint in enumerate(args):
            if constraint is not None:
                if value.shape[i] != constraint:
                    raise TraitError('Dimension %i is supposed to be size %d, but got dimension %d'%(i, constraint, value.shape[i]))
        return value
    return validator
