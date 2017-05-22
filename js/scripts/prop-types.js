var _ = require('underscore');

function BaseType() {}
_.extend(BaseType.prototype, {
    getJSPropertyValue: function() {
        return JSON.stringify(this.defaultValue);
    },
    getPropArrayName: function() {
        return null;
    },
    getPythonDefaultValue: function() {
        if (this.defaultValue === false) { return 'False'; }
        if (this.defaultValue === true) { return 'True'; }
        if (this.defaultValue === 0) { return '0'; }
        if (this.defaultValue === '') { return '""'; }
        if (!this.defaultValue) { return 'None'; }

        return JSON.stringify(this.defaultValue);
    },
    getPropertyConverterFn: function() {
        return null;
    },
    getPropertyAssignmentFn: function() {
        return null;
    },
})

function ThreeType(typeName, options={}) {
    this.typeName = typeName;
    this.defaultValue = null;
    this.serialize = true;
    this.nullable = options.nullable !== false;
}
_.extend(ThreeType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        // allow type unions
        if (this.typeName instanceof Array) {
            // TODO: only instan
            var instances = this.typeName.map(function(typeName) {
                return '        Instance(' + typeName + ', allow_none=' + nullableStr +')';
            });
            return 'Union([\n' + instances.join(',\n') + '\n    ]).tag(sync=True, **widget_serialization)';

            // return 'Any()';
        }

        if (this.typeName.toLowerCase() === 'this') {
            return 'This().tag(sync=True, **widget_serialization)';
        }

        return 'Instance(' + this.typeName + ', allow_none=' + nullableStr +').tag(sync=True, **widget_serialization)';
    },
    getPropArrayName: function() {
        return 'three_properties';
    },
    getPropertyConverterFn: function() {
        return 'convertThreeType';
    },
});

function ThreeTypeArray(typeName) {
    this.typeName = typeName;
    this.defaultValue = [];
    this.serialize = true;
}
_.extend(ThreeTypeArray.prototype, BaseType.prototype, {
    getTraitlet: function() {
        if (this.typeName === 'this') {
            // return 'List(trait=This(), default_value=[]).tag(sync=True, **widget_serialization)';
            return 'Tuple().tag(sync=True, **widget_serialization)';
        }
        // return 'List(trait=Instance(' + this.typeName + ')).tag(sync=True, **widget_serialization)';
        return 'Tuple().tag(sync=True, **widget_serialization)';
    },
    getPropArrayName: function() {
        return 'three_array_properties';
    },
    getPropertyConverterFn: function() {
        return 'convertThreeTypeArray';
    },
});

function ThreeTypeDict(typeName) {
    this.typeName = typeName;
    this.defaultValue = {};
    this.serialize = true;
}
_.extend(ThreeTypeDict.prototype, BaseType.prototype, {
    getTraitlet: function() {
        if (this.typeName === 'this') {
            return 'Dict(This()).tag(sync=True, **widget_serialization)';
        }
        return 'Dict(Instance(' + this.typeName + ')).tag(sync=True, **widget_serialization)';
    },
    getPropArrayName: function() {
        return 'three_dict_properties';
    },
    getPropertyConverterFn: function() {
        return 'convertThreeTypeDict';
    },
});

function Bool(defaultValue) {
    this.defaultValue = defaultValue;
}
_.extend(Bool.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var pyBoolValue = this.defaultValue ? 'True' : 'False';
        return 'Bool(' + pyBoolValue + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'scalar_properties';
    // },
});

function Int(defaultValue) {
    this.defaultValue = defaultValue == null ? 0 : defaultValue;
}
_.extend(Int.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'CInt(' + this.defaultValue + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'scalar_properties';
    // },

});

function Float(defaultValue) {
    this.defaultValue = defaultValue == null ? 0.0 : defaultValue;
}
_.extend(Float.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'CFloat(' + this.defaultValue + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'scalar_properties';
    // },

});

function StringType(defaultValue) {
    this.defaultValue = defaultValue;
}
_.extend(StringType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Unicode("' + this.defaultValue + '").tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'scalar_properties';
    // },

});

function Enum(enumTypeName, defaultValue) {
    this.enumTypeName = enumTypeName;
    this.defaultValue = defaultValue;
}
_.extend(Enum.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Enum(' + this.enumTypeName + ', "' + this.defaultValue + '").tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'enum_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertEnum';
    },
});

function Color(defaultValue) {
    this.defaultValue = defaultValue || "#ffffff";
}
_.extend(Color.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Unicode(' + JSON.stringify(this.defaultValue) + ').tag(sync=True)'
    },
    // getPropArrayName: function() {
    //     return 'color_properties';
    // }
    getPropertyConverterFn: function() {
        return 'convertColor';
    },
});

function ArrayType() {
    this.defaultValue = [];
}
_.extend(ArrayType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'List().tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // }
});

// TODO: support more than Float32Array
function ArrayBufferType(arrayType) {
    // this.arrayType = arrayType || 'Float32Array';
    this.defaultValue = [];
}
_.extend(ArrayBufferType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'List().tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertArrayBuffer';
    },
});

function DictType() {
    this.defaultValue = {};
}
_.extend(DictType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Dict().tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'dict_properties';
    // }
});

function FunctionType(fn) {
    this.defaultValue = fn || function() {};
}
_.extend(FunctionType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return "Unicode('" + this.defaultValue.toString() + "').tag(sync=True)";
    },
    // getPropArrayName: function() {
    //     return 'function_properties';
    // },
    getJSPropertyValue: function() {
        return this.defaultValue.toString();
    },
    getPropertyConverterFn: function() {
        return 'convertFunction';
    },
});

function Vector2(x, y) {
    this.defaultValue = [ x||0, y||0 ];
}
_.extend(Vector2.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Vector2(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'vector_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertVector';
    },
    getPropertyAssignmentFn: function() {
        return 'assignVector';
    },
});

function Vector3(x, y, z) {
    this.defaultValue = [ x||0, y||0, z||0 ];
}
_.extend(Vector3.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Vector3(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'vector_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertVector';
    },
    getPropertyAssignmentFn: function() {
        return 'assignVector';
    },
});

function Vector4(x, y, z, w) {
    this.defaultValue = [ x||0, y||0, z||0, w||0 ];
}
_.extend(Vector4.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Vector4(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'vector_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertVector';
    },
    getPropertyAssignmentFn: function() {
        return 'assignVector';
    },
});

function VectorArray() {
    this.defaultValue = [];
}
_.extend(VectorArray.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'List(trait=List()).tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertVectorArray';
    },
});

function FaceArray() {
    this.defaultValue = [];
}
_.extend(FaceArray.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Tuple(trait=Face3()).tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertFaceArray';
    },
});

function BufferAttribute() {
    this.defaultValue = null;
}
_.extend(BufferAttribute.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'BufferAttribute(default_value=None, allow_none=True).tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertBufferAttribute';
    },
});

function BufferAttributeDict() {
    this.defaultValue = {};
}
_.extend(BufferAttributeDict.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Tuple().tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'array_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertBufferAttributeDict';
    },
});

function Matrix3() {
    this.defaultValue = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];

}
_.extend(Matrix3.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Matrix3(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'vector_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertMatrix';
    },
    getPropertyAssignmentFn: function() {
        return 'assignMatrix';
    },
});

function Matrix4() {
    this.defaultValue = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}
_.extend(Matrix4.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Matrix4(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    // getPropArrayName: function() {
    //     return 'vector_properties';
    // },
    getPropertyConverterFn: function() {
        return 'convertMatrix';
    },
    getPropertyAssignmentFn: function() {
        return 'assignMatrix';
    },
});


module.exports = {
    ThreeType: ThreeType,
    ThreeTypeArray: ThreeTypeArray,
    ThreeTypeDict: ThreeTypeDict,
    Int: Int,
    Float: Float,
    String: StringType,
    Bool: Bool,
    Enum: Enum,
    Color: Color,
    Array: ArrayType,
    ArrayBuffer: ArrayBufferType,
    BufferAttribute: BufferAttribute,
    BufferAttributeDict: BufferAttributeDict,
    Dict: DictType,
    Function: FunctionType,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    VectorArray: VectorArray,
    FaceArray: FaceArray,
    Matrix3: Matrix3,
    Matrix4: Matrix4,
};
