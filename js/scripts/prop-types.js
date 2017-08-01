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
        if (this.defaultValue === Infinity) { return "float('inf')"; }
        if (this.defaultValue === -Infinity) { return "-float('inf')"; }
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
    this.args = options.args;
    this.kwargs = options.kwargs;
}
_.extend(ThreeType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        // allow type unions
        if (this.typeName instanceof Array) {
            var instances = this.typeName.map(function(typeName) {
                return `        Instance(${typeName}, allow_none=${nullableStr})`;
            });
            return 'Union([\n' + instances.join(',\n') + '\n    ]).tag(sync=True, **widget_serialization)';
        }

        if (this.typeName.toLowerCase() === 'this') {
            return 'This().tag(sync=True, **widget_serialization)';
        }

        var ret = `Instance(${this.typeName}`;
        if (this.args !== undefined) {
            ret += `, args=${this.args}`;
        }
        if (this.kwargs !== undefined) {
            ret += `, kw=${this.kwargs}`;
        }
        ret += `, allow_none=${nullableStr}).tag(sync=True, **widget_serialization)`;
        return ret;
    },
    getPropArrayName: function() {
        return 'three_properties';
    },
    getPropertyConverterFn: function() {
        return 'convertThreeType';
    },
});

function ForwardDeclaredThreeType(typeName, modulePath, options={}) {
    ThreeType.call(this, typeName, options);
    this.modulePath = modulePath;
}
_.extend(ForwardDeclaredThreeType.prototype, ThreeType.prototype, {
    forwardType: function() {
        return this.modulePath + '.' + this.typeName;
    },
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        // allow type unions
        if (this.typeName instanceof Array) {
            var instances = this.typeName.map(function(typeName) {
                return `        Instance('${this.forwardType()}', allow_none=${nullableStr})`;
            });
            return 'Union([\n' + instances.join(',\n') + '\n    ]).tag(sync=True, **widget_serialization)';
        }

        if (this.typeName.toLowerCase() === 'this') {
            return 'This().tag(sync=True, **widget_serialization)';
        }

        var ret = `Instance('${this.forwardType()}'`;
        if (this.args !== undefined) {
            ret += `, args=${this.args}`;
        }
        if (this.kwargs !== undefined) {
            ret += `, kw=${this.kwargs}`;
        }
        ret += `, allow_none=${nullableStr}).tag(sync=True, **widget_serialization)`;
        return ret;
    },
});

function InitializedThreeType(typeName, options={}) {
    ThreeType.call(this, typeName, options);
}
_.extend(InitializedThreeType.prototype, ThreeType.prototype, {
    getPropertyConverterFn: function() {
        return 'convertInitializedThreeType';
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
        return `Dict(Instance(${this.typeName})).tag(sync=True, **widget_serialization)`;
    },
    getPropArrayName: function() {
        return 'three_dict_properties';
    },
    getPropertyConverterFn: function() {
        return 'convertThreeTypeDict';
    },
});

function Bool(defaultValue, nullable) {
    this.nullable = nullable === true;
    this.defaultValue = defaultValue;
}
_.extend(Bool.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `Bool(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },
});

function Int(defaultValue, nullable) {
    this.nullable = nullable === true;
    this.defaultValue = defaultValue === null ? !this.nullable ? 0 : 'None' : defaultValue;
}
_.extend(Int.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `CInt(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },

});

function Float(defaultValue, nullable) {
    this.nullable = nullable === true;
    this.defaultValue = defaultValue == null ? !this.nullable ? 0.0 : 'None' : defaultValue;
}
_.extend(Float.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `CFloat(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },
    getPropertyConverterFn: function() {
        return 'convertFloat';
    },

});

function StringType(defaultValue, nullable) {
    this.nullable = nullable === true;
    this.defaultValue = defaultValue;
}
_.extend(StringType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `Unicode(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },

});

function Enum(enumTypeName, defaultValue, nullable) {
    this.enumTypeName = enumTypeName;
    this.defaultValue = defaultValue;
    this.nullable = nullable === true;
}
_.extend(Enum.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `Enum(${this.enumTypeName}, ${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },
    getPropertyConverterFn: function() {
        return 'convertEnum';
    },
});

function Color(defaultValue) {
    this.defaultValue = defaultValue || "#ffffff";
}
_.extend(Color.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return `Unicode(${this.getPythonDefaultValue()}).tag(sync=True)`;
    },
    getPropertyConverterFn: function() {
        return 'convertColor';
    },
});

function ColorArray(defaultValue) {
    this.defaultValue = defaultValue || "#ffffff";
}
_.extend(ColorArray.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'List(trait=List()).tag(sync=True)';
    },
    getPropertyConverterFn: function() {
        return 'convertColorArray';
    },
    getPropertyAssignmentFn: function() {
        return 'assignArray';
    },
});

function ArrayType() {
    this.defaultValue = [];
}
_.extend(ArrayType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'List().tag(sync=True)';
    },
    getPropertyAssignmentFn: function() {
        return 'assignArray';
    },
});

// TODO: support more than Float32Array
function ArrayBufferType(arrayType, shape_constraint) {
    this.arrayType = arrayType;
    this.shape_constraint = shape_constraint;
    this.defaultValue = [];
}
_.extend(ArrayBufferType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var r = `NDArray(dtype=${this.arrayType || 'None'}).tag(sync=True, **array_serialization)`;
        if (this.shape_constraint) {
            var constraint = this.shape_constraint.reduce(function(wip, element) {
                return wip + `, ${element === null ? 'None' : element}`;
            }, this);
            r += `.valid(shape_constraint([${this.shape_constraint}]))`
        }
        return r;
    },
    getPropertyConverterFn: function() {
        return 'convertArrayBuffer';
    },
});

function DictType(defaultValue={}, nullable) {
    this.defaultValue = defaultValue;
    this.nullable = nullable === true;
}
_.extend(DictType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        var nullableStr = this.nullable ? 'True' : 'False';
        return `Dict(default_value=${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    },
});

function FunctionType(fn) {
    this.defaultValue = fn || function() {};
}
_.extend(FunctionType.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return `Unicode('${this.defaultValue.toString()}').tag(sync=True)`;
    },
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
    getPropertyConverterFn: function() {
        return 'convertVectorArray';
    },
    getPropertyAssignmentFn: function() {
        return 'assignArray';
    },
});

function FaceArray() {
    this.defaultValue = [];
}
_.extend(FaceArray.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Tuple(trait=Face3()).tag(sync=True)';
    },
    getPropertyConverterFn: function() {
        return 'convertFaceArray';
    },
    getPropertyAssignmentFn: function() {
        return 'assignArray';
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
    getPropertyConverterFn: function() {
        return 'convertMatrix';
    },
    getPropertyAssignmentFn: function() {
        return 'assignMatrix';
    },
});


function Euler() {
    this.defaultValue = [0, 0, 0, 'XYZ'];
}

_.extend(Euler.prototype, BaseType.prototype, {
    getTraitlet: function() {
        return 'Euler(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    },
    getPropertyConverterFn: function() {
        return 'convertEuler';
    },
    getPropertyAssignmentFn: function() {
        return 'assignEuler';
    },
});


module.exports = {
    ThreeType: ThreeType,
    ForwardDeclaredThreeType: ForwardDeclaredThreeType,
    InitializedThreeType: InitializedThreeType,
    ThreeTypeArray: ThreeTypeArray,
    ThreeTypeDict: ThreeTypeDict,
    Int: Int,
    Float: Float,
    String: StringType,
    Bool: Bool,
    Enum: Enum,
    Color: Color,
    ColorArray: ColorArray,
    Array: ArrayType,
    ArrayBuffer: ArrayBufferType,
    Dict: DictType,
    Function: FunctionType,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    VectorArray: VectorArray,
    FaceArray: FaceArray,
    Matrix3: Matrix3,
    Matrix4: Matrix4,
    Euler: Euler,
};
