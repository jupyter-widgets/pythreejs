var _ = require('underscore');
require("../examples/controls/MomentumCameraControls.js");
var FlyControlsAutogen = require('./FlyControls.autogen');


var FlyControlsModel = FlyControlsAutogen.FlyControlsModel.extend({

    constructThreeObject: function() {
        var that = this;
        this.clock = new THREE.Clock();

        return widgets.resolvePromisesDict(this.model.get('controlling').views).then(function(views) {
                // get the view that is tied to the same renderer
                that.controlled_view = _.find(views, function(o) {
                    return o.options.renderer_id === that.options.renderer_id
                }, that);
                obj = new THREE.FlyControls(that.controlled_view.obj, that.options.dom);
                that.register_object_parameters();
                that.options.register_update(that._update, that);
                obj.addEventListener('change', that.options.render_frame);
                obj.addEventListener('change', function() { that.update_controlled(); });
                that.options.start_update_loop();
                that.model.on_some_change(['forward_speed', 'upward_speed', 'lateral_speed',
                                           'roll', 'yaw', 'pitch'], that.update_plane, that);
                delete that.options.renderer;
                return obj
            });
    },

    update_plane: function() {
        this.obj.moveState.back = this.model.get('forward_speed');
        this.obj.moveState.up = this.model.get('upward_speed');
        this.obj.moveState.left = this.model.get('lateral_speed');
        this.obj.moveState.pitchUp = this.model.get('pitch');
        this.obj.moveState.yawRight = this.model.get('yaw');
        this.obj.moveState.rollLeft = this.model.get('roll');
        this.obj.updateRotationVector();
        this.obj.updateMovementVector();
    },

    _update: function() {
        this.obj.movementSpeed = 0.33;
        this.obj.update(this.clock.getDelta());
    },

    update_controlled: function() {
        var controlling = this.get('controlling');
        var pos = controlling.obj.position;
        var qat = controlling.obj.quaternion;
        controlling.set({
                position: [pos.x, pos.y, pos.z],
                quaternion: [qat._x, qat._y, qat._z, qat._w],
            },
            'pushFromThree'
        );
    },

});

module.exports = {
    FlyControlsModel: FlyControlsModel,
};
