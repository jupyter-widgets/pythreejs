var _ = require('underscore');
var THREE = require('three');
var PickerAutogen = require('./Picker.autogen');


var PickerModel = PickerAutogen.PickerModel.extend({

    syncToThreeObj: function(force) {
    },

    syncToModel: function() {
    },

    constructThreeObject: function() {
        this.camera = null;
        var event = this.get('event');
        obj = new PickerControls(event);
        return obj;
    },

    setupListeners: function() {
        PickerAutogen.PickerModel.prototype.setupListeners.call(this);
        this.obj.addEventListener('pick', this.onPick.bind(this));
        this.on('enableControl', this.onEnable, this);
        this.on('disableControl', this.onDisable, this);
    },

    onEnable: function(view) {
        this.camera = view.camera;
    },

    onDisable: function(view) {
        this.camera = null;
    },

    onPick: function() {
        var mouse = this.obj.pickCoordinates;
        var objects = pick(mouse, this.camera, this.get('controlling').obj);

        var info = getinfo(objects.length > 0 ? objects[0] : null);

        if (this.get('all')) {
            info.picked = _.map(objs, getinfo);
        } else {
            info.picked = [];
        }
        this.set(info, 'pushFromThree');
        this.save_changes();
    },
});

var PickerControls = function(event) {

    var changeEvent = { type: 'change' };
    var pickEvent = { type: 'pick' };

    var scope = this;
    scope.element = null;

    this.pickCoordinates = null;

    this.connectEvents = function(element) {
        scope.element = element;
        element.addEventListener(event, onEvent, false);
    }

    this.dispose = function() {
        scope.element.removeEventListener(event, onEvent, false);
    }

    function onEvent( event ) {
        var $el = $(scope.element);
        var offset = $el.offset();
        var mouseX = ((event.pageX - offset.left) / $el.width()) * 2 - 1;
        var mouseY = -((event.pageY - offset.top) / $el.height()) * 2 + 1;

        scope.pickCoordinates = {x: mouseX, y: mouseY};

        scope.dispatchEvent( pickEvent );
    }

}

PickerControls.prototype = Object.create( THREE.EventDispatcher.prototype );
PickerControls.prototype.constructor = PickerControls;


function pick(mouse, camera, root) {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );
    return raycaster.intersectObject(root, true);
};


function getinfo(o) {
    if (o !== null) {
        var v;
        var verts;
        if (o.object.geometry.isBufferGeometry) {
            v = o.object.geometry.attributes.position.array;
            verts = [[v[o.face.a], v[o.face.a] + 1, v[o.face.a] + 2],
                     [v[o.face.b], v[o.face.b] + 1, v[o.face.b] + 2],
                     [v[o.face.c], v[o.face.c] + 1, v[o.face.c] + 2]];
        } else {
            v = o.object.geometry.vertices;
            verts = [[v[o.face.a].x, v[o.face.a].y, v[o.face.a].z],
                     [v[o.face.b].x, v[o.face.b].y, v[o.face.b].z],
                     [v[o.face.c].x, v[o.face.c].y, v[o.face.c].z]];
        }
        return {
            point: [o.point.x, o.point.y, o.point.z],
            distance: o.distance,
            face: [o.face.a, o.face.b, o.face.c],
            faceVertices: verts,
            indices: o.indices || [],
            faceNormal: [o.face.normal.x, o.face.normal.y, o.face.normal.z],
            faceIndex: o.faceIndex || null,
            object: o.object.ipymodel,
            uv: [o.uv.x, o.uv.y] || [0, 0],
        };
    }
    return {
        point: [0, 0, 0],
        distance: null,
        face: [0, 0, 0],
        faceVertices: [],
        indices: [],
        faceNormal: [0, 0, 0],
        faceIndex: null,
        object: null,
        uv: [0, 0],
    };
}



module.exports = {
    PickerModel: PickerModel,
};
