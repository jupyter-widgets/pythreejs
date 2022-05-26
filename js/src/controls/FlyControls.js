var THREE = require('three');
var FlyControls = require('../examples/controls/MomentumCameraControls.js').FlyControls;
var FlyControlsAutogen = require('./FlyControls.autogen');


class FlyControlsModel extends FlyControlsAutogen.FlyControlsModel {

    constructThreeObject() {
        this.clock = new THREE.Clock();
        var controlling = this.get('controlling');
        this.renderer = null;
        this.syncAtWill = true;

        var obj = new FlyControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        return obj;
    }

    setupListeners() {
        FlyControlsAutogen.FlyControlsModel.prototype.setupListeners.call(this);
        var that = this;
        this.obj.addEventListener('change', function() {
            // Throttle syncs:
            if (that.syncAtWill) {
                that.syncAtWill = false;
                that.update_controlled();
                setTimeout(that.allowSync.bind(that), 1000 * that.get('syncRate'));
            }
        });
        this.on('enableControl', this.onEnable, this);
        this.on('disableControl', this.onDisable, this);
    }

    onEnable(renderer) {
        this.clock.start();
        this.renderer = renderer;
        this._update();
    }

    onDisable(renderer) {
        this.clock.stop();
        this.renderer = null;
    }

    allowSync() {
        this.syncAtWill = true;
    }

    _update() {
        if (this.renderer !== null) {
            this.obj.update(this.clock.getDelta());
            requestAnimationFrame(this._update.bind(this));
        }
    }

    update_controlled() {
        var controlling = this.get('controlling');
        var pos = controlling.obj.position;
        var qat = controlling.obj.quaternion;
        controlling.set(
            {
                position: [pos.x, pos.y, pos.z],
                quaternion: [qat._x, qat._y, qat._z, qat._w],
            },
            'pushFromThree'
        );
        controlling.save_changes();
    }

}

module.exports = {
    FlyControlsModel: FlyControlsModel,
};
