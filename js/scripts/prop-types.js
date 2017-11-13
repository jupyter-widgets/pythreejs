'use strict';

const WIDGET_SERIALIZER = '{ deserialize: widgets.unpack_models }';

class BaseType {
    getJSPropertyValue() {
        return JSON.stringify(this.defaultValue);
    }
    getPropArrayName() {
        return null;
    }
    getPythonDefaultValue() {
        if (this.defaultValue === false) { return 'False'; }
        if (this.defaultValue === true) { return 'True'; }
        if (this.defaultValue === 0) { return '0'; }
        if (this.defaultValue === '') { return '""'; }
        if (this.defaultValue === Infinity) { return "float('inf')"; }
        if (this.defaultValue === -Infinity) { return "-float('inf')"; }
        if (!this.defaultValue) { return 'None'; }

        return JSON.stringify(this.defaultValue);
    }
    getPropertyConverterFn() {
        return null;
    }
    getPropertyAssignmentFn() {
        return null;
    }
}

function genInstanceTraitlet(typeName, nullable, args, kwargs) {
    const nullableStr = nullable ? 'True' : 'False';
    // allow type unions
    if (typeName instanceof Array) {
        const instances = typeName.map(function(tname) {
            return `        Instance(${tname}, allow_none=${nullableStr})`;
        });
        return 'Union([\n' + instances.join(',\n') + '\n    ]).tag(sync=True, **widget_serialization)';
    }

    if (typeName.toLowerCase() === 'this') {
        return 'This().tag(sync=True, **widget_serialization)';
    }

    let ret = `Instance(${typeName}`;
    if (args !== undefined) {
        ret += `, args=${args}`;
    }
    if (kwargs !== undefined) {
        ret += `, kw=${kwargs}`;
    }
    ret += `, allow_none=${nullableStr}).tag(sync=True, **widget_serialization)`;
    return ret;
}

class ThreeType extends BaseType {
    constructor(typeName, options={}) {
        super();
        this.typeName = typeName || '';
        this.defaultValue = null;
        this.serializer = WIDGET_SERIALIZER;
        this.nullable = options.nullable !== false;
        this.args = options.args;
        this.kwargs = options.kwargs;
    }
    getTraitlet() {
        let typeName = this.typeName;
        if (typeName instanceof Array) {
            for (let tname of typeName) {
                return `${tname || 'ThreeWidget'}`;
            }
        } else {
            typeName = `${typeName || 'ThreeWidget'}`;
        }
        return genInstanceTraitlet(
            typeName, this.nullable, this.args, this.kwargs);
    }
    getPropArrayName() {
        return 'three_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeType';
    }
}

class ForwardDeclaredThreeType extends ThreeType {
    constructor(typeName, modulePath, options={}) {
        super(typeName, options);
        this.modulePath = modulePath;
    }
    forwardType() {
        return this.modulePath + '.' + this.typeName;
    }
    getTraitlet() {
        return genInstanceTraitlet(
            this.forwardType(), this.nullable, this.args, this.kwargs);
    }
}

class InitializedThreeType extends ThreeType {
    getJSPropertyValue() {
        return '"uninitialized"';
    }
    getPythonDefaultValue() {
        return 'UninitializedSentinel';
    }
    getTraitlet() {
        const typeName = this.typeName;
        const nullableStr = this.nullable ? 'True' : 'False';
        let inst = `Instance(${typeName}`;
        if (this.args !== undefined) {
            inst += `, args=${this.args}`;
        }
        if (this.kwargs !== undefined) {
            inst += `, kw=${this.kwargs}`;
        }
        inst += ')';
        const uninit = 'Instance(Uninitialized)';
        let ret = `Union([\n        ${uninit},\n        ${inst},\n        ]`;
        ret += `, default_value=${this.getPythonDefaultValue()}, allow_none=${nullableStr})`;
        ret += '.tag(sync=True, **unitialized_serialization)';
        return ret;
    }
}

class ThreeTypeArray extends BaseType {
    constructor(typeName, options={}) {
        super();
        this.typeName = typeName;
        this.defaultValue = [];
        this.serializer = WIDGET_SERIALIZER;
        this.nullable = options.nullable !== false;
        this.allow_single = options.allow_single === true;
    }
    getTraitlet() {
        let baseType = 'Tuple()';
        if (this.allow_single) {
            if (this.typeName === 'this') {
                baseType = 'Union([This, ' + baseType + '])';
            } else {
                baseType = 'Union([Instance(' + this.typeName + '), ' + baseType + '])';
            }
        }
        if (this.typeName === 'this') {
            // return 'List(trait=This(), default_value=[]).tag(sync=True, **widget_serialization)';
            return baseType + '.tag(sync=True, **widget_serialization)';
        }
        // return 'List(trait=Instance(' + this.typeName + ')).tag(sync=True, **widget_serialization)';
        return baseType + '.tag(sync=True, **widget_serialization)';
    }
    getPropArrayName() {
        return 'three_nested_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeTypeArray';
    }
}

class ThreeTypeDict extends BaseType {
    constructor(typeName) {
        super();
        this.typeName = typeName;
        this.defaultValue = {};
        this.serializer = WIDGET_SERIALIZER;
    }
    getTraitlet() {
        if (this.typeName instanceof Array) {
            const instances = this.typeName.map(function(typeName) {
                return `        Instance(${typeName})`;
            });
            return 'Dict(Union([\n' + instances.join(',\n') + '\n    ])).tag(sync=True, **widget_serialization)';
        }
        if (this.typeName === 'this') {
            return 'Dict(This()).tag(sync=True, **widget_serialization)';
        }
        return `Dict(Instance(${this.typeName})).tag(sync=True, **widget_serialization)`;
    }
    getPropArrayName() {
        return 'three_nested_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeTypeDict';
    }
}

class BufferMorphAttributes extends BaseType {
    constructor() {
        super();
        this.defaultValue = {};
        this.serializer = WIDGET_SERIALIZER;
    }
    getTraitlet() {
        const typeNames = ['BufferAttribute', 'InterleavedBufferAttribute'];
        const instances = typeNames.map(function(typeName) {
            return `        Instance(${typeName})`;
        });
        return 'Dict(Tuple(Union([\n' + instances.join(',\n') + '\n    ]))).tag(sync=True, **widget_serialization)';
    }
    getPropArrayName() {
        return 'three_nested_properties';
    }
    getPropertyConverterFn() {
        return 'convertMorphAttributes';
    }
}

class Bool extends BaseType {
    constructor(defaultValue, options) {
        super();
        options = options || {};
        this.nullable = options.nullable === true;
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        return `Bool(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertBool';
    }
}

class Int extends BaseType {
    constructor(defaultValue, options) {
        super();
        options = options || {};
        this.nullable = options.nullable === true;
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.defaultValue = (defaultValue === null || defaultValue === undefined) && !this.nullable ? 0 : defaultValue ;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        let limits = '';
        if (this.minValue !== undefined) {
            limits += `, min=${this.minValue}`;
        }
        if (this.maxValue !== undefined) {
            limits += `, max=${this.maxValue}`;
        }
        return `CInt(${this.getPythonDefaultValue()}, allow_none=${nullableStr}${limits}).tag(sync=True)`;
    }

}

class Float extends BaseType {
    constructor(defaultValue, options) {
        super();
        options = options || {};
        this.nullable = options.nullable === true;
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.defaultValue = (defaultValue === null || defaultValue === undefined) && !this.nullable ? 0.0 : defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        let limits = '';
        if (this.minValue !== undefined) {
            limits += `, min=${this.minValue}`;
        }
        if (this.maxValue !== undefined) {
            limits += `, max=${this.maxValue}`;
        }
        return `CFloat(${this.getPythonDefaultValue()}, allow_none=${nullableStr}${limits}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertFloat';
    }

}

class StringType extends BaseType {
    constructor(defaultValue, options) {
        super();
        options = options || {};
        this.nullable = options.nullable === true;
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        return `Unicode(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    }

}

class Enum extends BaseType {
    constructor(enumTypeName, defaultValue, options) {
        super();
        options = options || {};
        this.enumTypeName = enumTypeName;
        this.defaultValue = defaultValue;
        this.nullable = options.nullable === true;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        return `Enum(${this.enumTypeName}, ${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertEnum';
    }
}

class Color extends BaseType {
    constructor(defaultValue, options) {
        super();
        options = options || {};
        this.defaultValue = defaultValue || "#ffffff";
        this.nullable = options.nullable === true;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        return `Unicode(${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertColor';
    }
}

class ColorArray extends BaseType {
    constructor(defaultValue) {
        super();
        this.defaultValue = defaultValue || ["#ffffff"];
    }
    getTraitlet() {
        return `List(trait=Unicode(), default_value=${this.getPythonDefaultValue()}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertColorArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class ArrayType extends BaseType {
    constructor() {
        super();
        this.defaultValue = [];
    }
    getTraitlet() {
        return 'List().tag(sync=True)';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}


class ArrayBufferType extends BaseType {
    constructor(arrayType, shapeConstraint) {
        super();
        this.arrayType = arrayType;
        this.shapeConstraint = shapeConstraint;
        this.defaultValue = null;
        this.serializer = 'dataserializers.data_union_serialization';
    }
    getTraitlet() {
        const args = [];
        if (this.arrayType) {
            args.push(`dtype=${this.arrayType}`);
        }
        if (this.shapeConstraint) {
            args.push(`shape_constraint=${this.shapeConstraint}`);
        }

        return `WebGLDataUnion(${args.join(', ')}).tag(sync=True)`;
    }
    getPropertyConverterFn() {
        return 'convertArrayBuffer';
    }
    getPropArrayName() {
        return 'datawidget_properties';
    }
}

class DictType extends BaseType {
    constructor(defaultValue={}, options) {
        super();
        options = options || {};
        this.defaultValue = defaultValue;
        this.nullable = options.nullable === true;
    }
    getTraitlet() {
        const nullableStr = this.nullable ? 'True' : 'False';
        return `Dict(default_value=${this.getPythonDefaultValue()}, allow_none=${nullableStr}).tag(sync=True)`;
    }
    getPropertyAssignmentFn() {
        return 'assignDict';
    }
}

class FunctionType extends BaseType {
    constructor(fn) {
        super();
        this.defaultValue = fn || function() {};
    }
    getTraitlet() {
        return `Unicode('${this.defaultValue.toString()}').tag(sync=True)`;
    }
    getJSPropertyValue() {
        return this.defaultValue.toString();
    }
    getPropertyConverterFn() {
        return 'convertFunction';
    }
}

class Vector2 extends BaseType {
    constructor(x, y) {
        super();
        this.defaultValue = [ x||0, y||0 ];
    }
    getTraitlet() {
        return 'Vector2(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class Vector3 extends BaseType {
    constructor(x, y, z) {
        super();
        this.defaultValue = [ x||0, y||0, z||0 ];
    }
    getTraitlet() {
        return 'Vector3(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class Vector4 extends BaseType {
    constructor(x, y, z, w) {
        super();
        this.defaultValue = [ x||0, y||0, z||0, w||0 ];
    }
    getTraitlet() {
        return 'Vector4(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class VectorArray extends BaseType {
    constructor() {
        super();
        this.defaultValue = [];
    }
    getTraitlet() {
        return 'List(trait=List()).tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertVectorArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class FaceArray extends BaseType {
    constructor() {
        super();
        this.defaultValue = [];
    }
    getTraitlet() {
        return 'Tuple(trait=Face3()).tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertFaceArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class Matrix3 extends BaseType {
    constructor() {
        super();
        this.defaultValue = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    getTraitlet() {
        return 'Matrix3(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertMatrix';
    }
    getPropertyAssignmentFn() {
        return 'assignMatrix';
    }
}

class Matrix4 extends BaseType {
    constructor() {
        super();
        this.defaultValue = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    getTraitlet() {
        return 'Matrix4(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertMatrix';
    }
    getPropertyAssignmentFn() {
        return 'assignMatrix';
    }
}


class Euler extends BaseType {
    constructor() {
        super();
        this.defaultValue = [0, 0, 0, 'XYZ'];
    }

    getTraitlet() {
        return 'Euler(default=' + JSON.stringify(this.defaultValue) + ').tag(sync=True)';
    }
    getPropertyConverterFn() {
        return 'convertEuler';
    }
    getPropertyAssignmentFn() {
        return 'assignEuler';
    }
}


module.exports = {
    ThreeType: ThreeType,
    ForwardDeclaredThreeType: ForwardDeclaredThreeType,
    InitializedThreeType: InitializedThreeType,
    ThreeTypeArray: ThreeTypeArray,
    ThreeTypeDict: ThreeTypeDict,
    BufferMorphAttributes: BufferMorphAttributes,
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
