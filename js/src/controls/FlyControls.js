var _ = require('underscore');
var THREE = require('three');
var widgets = require('@jupyter-widgets/base');
var FlyControls = require("../examples/controls/MomentumCameraControls.js").FlyControls;
var FlyControlsAutogen = require('./FlyControls.autogen');


var FlyControlsModel = FlyControlsAutogen.FlyControlsModel.extend({

    constructThreeObject: function() {
        this.clock = new THREE.Clock();
        var controlling = this.get('controlling');
        this.renderer = null;

        obj = new FlyControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        return obj
    },

    setupListeners: function() {
        FlyControlsAutogen.FlyControlsModel.prototype.setupListeners.call(this);
        var that = this;
        this.obj.addEventListener('change', function() {
            that.update_controlled();
        });
        this.on('enableControl', this.onEnable, this);
        this.on('disableControl', this.onDisable, this);
    },

    onEnable: function(renderer) {
        this.clock.start();
        this.renderer = renderer;
        this._update();
    },

    onDisable: function(renderer) {
        this.clock.stop();
        this.renderer = null;
    },

    _update: function() {
        this.obj.update(this.clock.getDelta());
        if (this.renderer !== null) {
            requestAnimationFrame(this._update.bind(this));
        }
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
        controlling.save_changes();
    },

});

module.exports = {
    FlyControlsModel: FlyControlsModel,
};
