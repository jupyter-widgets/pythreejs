var widgets = require("jupyter-js-widgets");
var pkgName = require('../package.json').name;

var ThreeView = widgets.WidgetView.extend({

    initialize: function () {

        widgets.WidgetView.prototype.initialize.apply(this, arguments);
        this.new_properties();

    },

    render: function() {

        this.obj = this.new_obj();
        this.register_object_parameters();

        // if the update function returns a promise or other non-zero value, return that
        // otherwise, return the object we created
        var update = this.update();

        // pickers need access to the model from the three.js object
        // this.obj may not exist until after the update() call above
        this.obj.threejs_view = this;

        return update ? update : this.obj;

    },

    new_properties: function() {

        // initialize properties arrays
        this.array_properties = [];
        this.scalar_properties = [];
        this.enum_properties = [];
        this.set_properties = []; // properties we set using the set method
        this.child_properties = [];

        // TODO: handle submodel properties?
    },

    update: function() {

        // this.replace_obj(this.new_obj());
        // this.update_object_parameters();
        this.needs_update();

    },

    replace_obj: function(new_obj) {

        var old_obj = this.obj;
        this.obj = new_obj;
        this.obj.threejs_view = this;
        this.update_object_parameters();
        this.trigger('replace_obj', old_obj, new_obj);

    },

    new_obj: function() {},

    needs_update: function() {

        this.obj.needsUpdate = true;
        this.trigger('rerender');

    },

    register_object_parameters: function() {

        // create an array of update handlers for each declared property
        // the update handlers depend on the type of property

        var array_properties = this.array_properties;
        var updates = this.updates = {};
        // first, we create update functions for each attribute
        _.each(this.array_properties, function(p) {
            updates[p] = function(t, value) {
                if (value.length !== 0) {
                    // the default is the empty list,
                    // and we don't act in that case
                    t.obj[p].fromArray(value);
                }
            }});

        _.each(this.scalar_properties, function(p) {
            updates[p] = function(t, value) {
                t.obj[p] = value;
            }});

        _.each(this.enum_properties, function(p) {
            updates[p] = function(t, value) {
                t.obj[p] = THREE[value];
            }});

        _.each(this.set_properties, function(p) {
            updates[p] = function(t, value) {
                t.obj[p].set(value);
            }});

        _.each(this.child_properties, function(p) {
            updates[p] = function(t, value) {
                if (value) {
                    if (t[p]) {
                        t.stopListening(t[p]);
                    }
                    t.create_child_view(value, t.options[p]).then(function(view) {
                        t[p] = view;
                        var update = function() {
                            t.obj[p] = t[p].obj;
                            t.needs_update()
                        };
                        update();
                        t.listenTo(t[p], 'replace_obj', update)
                    });
                }
            }});

        // next, we call and then register the update functions to changes
        _.each(updates, function(update, p) {
            update(this, this.model.get(p));
            this.model.on('change:'+p, function(model, value, options) {
                update(this, value);
            }, this);
        }, this);

    },

    update_object_parameters: function() {
        
        _.each(this.updates, function(update, p) {
            update(this, this.model.get(p));
        }, this);

    }

});

var ThreeModel = widgets.WidgetModel.extend({

    defaults: _.extend({}, widgets.WidgetModel.prototype.defaults, {
        _model_module: pkgName,
        _view_module: pkgName,
        _model_name: 'ThreeModel',
        _view_name: 'ThreeView'
    })

}, {

    serializers: _.extend({}, widgets.WidgetModel.serializers)

});

module.exports = {
    ThreeView: ThreeView,
    ThreeModel: ThreeModel,
};
