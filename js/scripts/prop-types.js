'use strict';

const WIDGET_SERIALIZER = '{ deserialize: widgets.unpack_models }';

class BaseType {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.nullable = options.nullable === true;
    }
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
        if (this.defaultValue === '') { return "''"; }
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
    getTagParts() {
        return ['sync=True'];
    }
    getTagString() {
        return `.tag(${this.getTagParts().join(', ')})`;
    }
    getNullableStr() {
        return `allow_none=${this.nullable === true ? 'True' : 'False'}`;
    }
}

function genInstanceTraitlet(typeName, nullable, args, kwargs, tagParts) {
    const nullableStr = `allow_none=${nullable === true ? 'True' : 'False'}`;
    tagParts = tagParts.concat(['**widget_serialization']);
    const tagStr = `.tag(${tagParts.join(', ')})`;
    // allow type unions
    if (typeName instanceof Array) {
        const instances = typeName.map(function(tname) {
            return `        Instance(${tname}, ${nullableStr})`;
        });
        return `Union([\n${instances.join(',\n')}\n    ])${tagStr}`;
    }

    if (typeName.toLowerCase() === 'this') {
        return `This()${tagStr}`;
    }

    let ret = `Instance(${typeName}`;
    if (args !== undefined) {
        ret += `, args=${args}`;
    }
    if (kwargs !== undefined) {
        ret += `, kw=${kwargs}`;
    }
    ret += `, ${nullableStr})${tagStr}`;
    return ret;
}

class ThreeType extends BaseType {
    constructor(typeName, options) {
        options = options || {};
        super(options);
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
            typeName = typeName.map(tname => {
                return `${tname || 'ThreeWidget'}`;
            });
        } else {
            typeName = `${typeName || 'ThreeWidget'}`;
        }
        return genInstanceTraitlet(
            typeName, this.nullable, this.args, this.kwargs, this.getTagParts());
    }
    getPropArrayName() {
        return 'three_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeType';
    }
}

class ForwardDeclaredThreeType extends ThreeType {
    constructor(typeName, modulePath, options) {
        super(typeName, options);
        this.modulePath = modulePath;
    }
    forwardType() {
        return this.modulePath + '.' + this.typeName;
    }
    getTraitlet() {
        return genInstanceTraitlet(
            this.forwardType(), this.nullable, this.args, this.kwargs, this.getTagParts());
    }
}

class InitializedThreeType extends ThreeType {
    getJSPropertyValue() {
        return "'uninitialized'";
    }
    getPythonDefaultValue() {
        return 'UninitializedSentinel';
    }
    getTagParts() {
        return super.getTagParts().concat(['**unitialized_serialization']);
    }
    getTraitlet() {
        const typeName = this.typeName;
        const nullableStr = this.getNullableStr();
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
        ret += `, default_value=${this.getPythonDefaultValue()}, ${nullableStr})`;
        ret += this.getTagString();
        return ret;
    }
}

class ThreeTypeArray extends BaseType {
    constructor(typeName, options) {
        options = options || {};
        super(options);
        this.typeName = typeName;
        this.defaultValue = [];
        this.serializer = WIDGET_SERIALIZER;
        this.nullable = options.nullable !== false;
        this.allow_single = options.allow_single === true;
    }
    getTagParts() {
        return super.getTagParts().concat(['**widget_serialization']);
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
            return baseType + this.getTagString();
        }
        // return 'List(trait=Instance(' + this.typeName + ')).tag(sync=True, **widget_serialization)';
        return baseType + this.getTagString();
    }
    getPropArrayName() {
        return 'three_nested_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeTypeArray';
    }
}

class ThreeTypeDict extends BaseType {
    constructor(typeName, options) {
        super(options);
        this.typeName = typeName;
        this.defaultValue = {};
        this.serializer = WIDGET_SERIALIZER;
    }
    getTagParts() {
        return super.getTagParts().concat(['**widget_serialization']);
    }
    getTraitlet() {
        if (this.typeName instanceof Array) {
            const instances = this.typeName.map(function(typeName) {
                return `        Instance(${typeName})`;
            });
            return `Dict(Union([\n${instances.join(',\n')}\n    ]))${this.getTagString()}`;
        }
        if (this.typeName === 'this') {
            return `Dict(This())${this.getTagString()}`;
        }
        return `Dict(Instance(${this.typeName}))${this.getTagString()}`;
    }
    getPropArrayName() {
        return 'three_nested_properties';
    }
    getPropertyConverterFn() {
        return 'convertThreeTypeDict';
    }
}

class BufferMorphAttributes extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = {};
        this.serializer = WIDGET_SERIALIZER;
    }
    getTagParts() {
        return super.getTagParts().concat(['**widget_serialization']);
    }
    getTraitlet() {
        const typeNames = ['BufferAttribute', 'InterleavedBufferAttribute'];
        const instances = typeNames.map(function(typeName) {
            return `        Instance(${typeName})`;
        });
        return 'Dict(Tuple(Union([\n' + instances.join(',\n') + '\n    ])))' + this.getTagString();
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
        super(options);
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        return `Bool(${this.getPythonDefaultValue()}, ${nullableStr})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertBool';
    }
}

class Int extends BaseType {
    constructor(defaultValue, options) {
        options = options || {};
        super();
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.defaultValue = (defaultValue === null || defaultValue === undefined) && !this.nullable ? 0 : defaultValue ;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        let limits = '';
        if (this.minValue !== undefined) {
            limits += `, min=${this.minValue}`;
        }
        if (this.maxValue !== undefined) {
            limits += `, max=${this.maxValue}`;
        }
        return `CInt(${this.getPythonDefaultValue()}, ${nullableStr}${limits})${this.getTagString()}`;
    }

}

class Float extends BaseType {
    constructor(defaultValue, options) {
        options = options || {};
        super(options);
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.defaultValue = (defaultValue === null || defaultValue === undefined) && !this.nullable ? 0.0 : defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        let limits = '';
        if (this.minValue !== undefined) {
            limits += `, min=${this.minValue}`;
        }
        if (this.maxValue !== undefined) {
            limits += `, max=${this.maxValue}`;
        }
        return `CFloat(${this.getPythonDefaultValue()}, ${nullableStr}${limits})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertFloat';
    }

}

class StringType extends BaseType {
    constructor(defaultValue, options) {
        super(options);
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        return `Unicode(${this.getPythonDefaultValue()}, ${nullableStr})${this.getTagString()}`;
    }

}

class Enum extends BaseType {
    constructor(enumTypeName, defaultValue, options) {
        super(options);
        this.enumTypeName = enumTypeName;
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        return `Enum(${this.enumTypeName}, ${this.getPythonDefaultValue()}, ${nullableStr})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertEnum';
    }
}

class Color extends BaseType {
    constructor(defaultValue, options) {
        super(options);
        this.defaultValue = defaultValue || '#ffffff';
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        return `Unicode(${this.getPythonDefaultValue()}, ${nullableStr})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertColor';
    }
}

class ColorArray extends BaseType {
    constructor(defaultValue, options) {
        super(options);
        this.defaultValue = defaultValue || ['#ffffff'];
    }
    getTraitlet() {
        return `List(trait=Unicode(), default_value=${this.getPythonDefaultValue()})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertColorArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class ArrayType extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [];
    }
    getTraitlet() {
        return `List()${this.getTagString()}`;
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}


class ArrayBufferType extends BaseType {
    constructor(arrayType, shapeConstraint, options) {
        super(options);
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

        return `WebGLDataUnion(${args.join(', ')})${this.getTagString()}`;
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
        super(options);
        this.defaultValue = defaultValue;
    }
    getTraitlet() {
        const nullableStr = this.getNullableStr();
        return `Dict(default_value=${this.getPythonDefaultValue()}, ${nullableStr})${this.getTagString()}`;
    }
    getPropertyAssignmentFn() {
        return 'assignDict';
    }
}

class UniformDict extends DictType {
    getPropertyConverterFn() {
        return 'convertUniformDict';
    }
}

class FunctionType extends BaseType {
    constructor(fn, options) {
        super(options);
        this.defaultValue = fn || function() {};
    }
    getTraitlet() {
        return `Unicode('${this.defaultValue.toString()}')${this.getTagString()}`;
    }
    getJSPropertyValue() {
        return this.defaultValue.toString();
    }
    getPropertyConverterFn() {
        return 'convertFunction';
    }
}

class Vector2 extends BaseType {
    constructor(x, y, options) {
        super(options);
        this.defaultValue = [ x||0, y||0 ];
    }
    getTraitlet() {
        return `Vector2(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class Vector3 extends BaseType {
    constructor(x, y, z, options) {
        super(options);
        this.defaultValue = [ x||0, y||0, z||0 ];
    }
    getTraitlet() {
        return `Vector3(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class Vector4 extends BaseType {
    constructor(x, y, z, w, options) {
        super(options);
        this.defaultValue = [ x||0, y||0, z||0, w||0 ];
    }
    getTraitlet() {
        return `Vector4(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertVector';
    }
    getPropertyAssignmentFn() {
        return 'assignVector';
    }
}

class VectorArray extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [];
    }
    getTraitlet() {
        return `List(trait=List())${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertVectorArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class FaceArray extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [];
    }
    getTraitlet() {
        return `Tuple(trait=Face3())${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertFaceArray';
    }
    getPropertyAssignmentFn() {
        return 'assignArray';
    }
}

class Matrix3 extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    getTraitlet() {
        return `Matrix3(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertMatrix';
    }
    getPropertyAssignmentFn() {
        return 'assignMatrix';
    }
}

class Matrix4 extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    getTraitlet() {
        return `Matrix4(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
    }
    getPropertyConverterFn() {
        return 'convertMatrix';
    }
    getPropertyAssignmentFn() {
        return 'assignMatrix';
    }
}


class Euler extends BaseType {
    constructor(options) {
        super(options);
        this.defaultValue = [0, 0, 0, 'XYZ'];
    }

    getTraitlet() {
        return `Euler(default_value=${JSON.stringify(this.defaultValue)})${this.getTagString()}`;
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
    UniformDict: UniformDict,
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
