var base = require('../base');

var Object3dView = base.ThreeView.extend({
    initialize: function() {
        ThreeView.prototype.initialize.apply(this, arguments);
        var that = this;
        this.children = new widgets.ViewList(
            function add(model) {
                return that.create_child_view(model,
                    _.pick(that.options, 'register_update', 'renderer_id'))
                    .then(function(view) {
                        that.obj.add(view.obj);
                        that.listenTo(view, 'replace_obj', that.replace_child_obj);
                        that.listenTo(view, 'rerender', that.needs_update);
                        that.needs_update(); // initial rendering
                        return view;
                    });
            },
            function remove(view) {
                that.obj.remove(view.obj);
                that.stopListening(view);
                view.remove();
            });
        this.children.update(this.model.get('children'));
        this.listenTo(this.model, 'change:children', function(model, value) {
            this.children.update(value);
        });
    },

    new_properties: function() {
        ThreeView.prototype.new_properties.call(this);
        this.array_properties.push('position', 'quaternion', 'up', 'scale');
        this.scalar_properties.push('visible', 'castShadow', 'receiveShadow');
    },

    new_obj: function() {
        return new THREE.Object3D();
    },

    replace_child_obj: function(old_obj, new_obj) {
        this.obj.remove(old_obj);
        this.obj.add(new_obj);
        this.needs_update()
    },

    replace_obj: function(new_obj) {
        // add three.js children objects to new three.js object
        Promise.all(this.children.views).then(function(views) {
            for (var i=0; i<views.length; i++) {
                new_obj.add(views[i].obj)
            }
        });
        ThreeView.prototype.replace_obj.apply(this, arguments);
    },
});

var ScaledObjectView = Object3dView.extend({
    render: function() {
        this.options.register_update(this.update_scale, this);
        Object3dView.prototype.render.call(this);
    },

    update_scale: function(renderer) {
        var s = renderer.camera.obj.position.length() / 10;
        // one unit is about 1/10 the size of the window
        this.obj.scale.set(s,s,s);
    }
});

var Object3dModel = base.ThreeModel.extend({
    defaults: _.extend({}, base.ThreeModel.prototype.defaults, {
        _view_name: 'Object3dView',
        _model_name: 'Object3dModel'
    })
}, {
    serializers: _.extend({
        children: { deserialize: widgets.unpack_models }
    }, base.ThreeModel.serializers)
});

var ScaledObjectModel = Object3dModel.extend({
    defaults: _.extend({}, Object3dModel.prototype.defaults, {
        _view_name: 'ScaledObjectView',
        _model_name: 'ScaledObjectModel'
    })
});

module.exports = {
    Object3dView: Object3dView,
    Object3dModel: Object3dModel,
    ScaledObjectView: ScaledObjectView,
    ScaledObjectModel: ScaledObjectModel,
};

