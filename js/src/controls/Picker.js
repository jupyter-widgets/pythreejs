var _ = require('underscore');
var PickerAutogen = require('./Picker.autogen');


var PickerModel = PickerAutogen.PickerModel.extend({});


// TODO: Reimplement picker to work with updated model/view separation!

/*
var PickerView = PickerAutogen.PickerView.extend({
    render: function() {
        var that = this;
        this.model.on('change:root', this.change_root, this);
        this.change_root(this.model, this.model.get('root'));
        this.options.dom.addEventListener(this.model.get('event'), function(event) {
            var offset = $(this).offset();
            var $el = $(that.options.dom);
            var mouseX = ((event.pageX - offset.left) / $el.width()) * 2 - 1;
            var mouseY = -((event.pageY - offset.top) / $el.height()) * 2 + 1;
            var vector = new THREE.Vector3(mouseX, mouseY, that.options.renderer.camera.obj.near);

            vector.unproject(that.options.renderer.camera.obj);
            var ray = vector.sub(that.options.renderer.camera.obj.position).normalize();
            that.obj = new THREE.Raycaster(that.options.renderer.camera.obj.position, ray);
            var objs = that.obj.intersectObject(that.root.obj, true);
            var getinfo = function(o) {
                var v = o.object.geometry.vertices;
                var verts = [[v[o.face.a].x, v[o.face.a].y, v[o.face.a].z],
                                [v[o.face.b].x, v[o.face.b].y, v[o.face.b].z],
                                [v[o.face.c].x, v[o.face.c].y, v[o.face.c].z]]
                return {
                    point: [o.point.x, o.point.y, o.point.z],
                    distance: o.distance,
                    face: [o.face.a, o.face.b, o.face.c],
                    faceVertices: verts,
                    faceNormal: [o.face.normal.x, o.face.normal.y, o.face.normal.z],
                    faceIndex: o.faceIndex,
                    object: o.object.threejs_view.model
                }
            }
            if(objs.length > 0) {
                // perhaps we should set all attributes to null if there are
                // no intersections?
                var o = getinfo(objs[0]);
                that.model.set('point', o.point);
                that.model.set('distance', o.distance);
                that.model.set('face', o.face);
                that.model.set('faceVertices', o.faceVertices);
                that.model.set('faceNormal', o.faceNormal);
                that.model.set('object', o.object);
                that.model.set('faceIndex', o.faceIndex);
                if (that.model.get('all')) {
                    that.model.set('picked', _.map(objs, getinfo));
                }
                that.touch();
            }
        });
    },

    change_root: function(model, root) {
        if (root) {
            // we need to get the three.js object for the root object in our scene
            // so find a view of the model that exists in our scene
            var that = this;
            widgets.resolvePromisesDict(root.views).then(function(views) {
                var r = _.find(views, function(o) {
                    return o.options.renderer_id === that.options.renderer_id;
                });
                that.root = r;
            }).catch(widgets.reject('Could not set up Picker', true));
        } else {
            this.root = this.options.renderer.scene;
        }
    }
});
*/

module.exports = {
    PickerModel: PickerModel,
    //PickerView: PickerView,
};
