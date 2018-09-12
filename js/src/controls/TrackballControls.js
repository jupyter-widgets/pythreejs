var _ = require('underscore');
var TrackballControls = require('../examples/controls/TrackballControls.js').TrackballControls;
var TrackballControlsAutogen = require('./TrackballControls.autogen');

var TrackballControlsModel = TrackballControlsAutogen.TrackballControlsModel.extend({

    constructThreeObject: function() {
        var controlling = this.get('controlling');
        var obj = new TrackballControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        obj.noKeys = true; // turn off keyboard navigation

        return obj;
    },

    setupListeners: function() {
        TrackballControlsAutogen.TrackballControlsModel.prototype.setupListeners.call(this);
        var that = this;
        this.obj.addEventListener('end', function() {
            that.update_controlled();
        });
    },

    // push data from model to the three object
    syncToThreeObj: function() {
        TrackballControlsAutogen.TrackballControlsModel.prototype.syncToThreeObj.apply(this, arguments);

        // We want updates to, e.g., 'target' from the Python side to take
        // effect immediately so that there isn't a jump at the start of the
        // next user interaction. This is especially important for the changes
        // made when reconstructing an embedded widget.
        this.obj.update();

        // Updating the target alone doesn't change the controlled object's
        // position, so TrackballControls::update won't dispatch a changeEvent;
        // we need to emit one manually.
        this.obj.dispatchEvent({type: 'change'});
    },

    update_controlled: function() {
        // Since TrackballControlsView changes the position of the object,
        // we update the position when we've stopped moving the object.
        // It's probably prohibitive to update it in real-time
        var controlling = this.get('controlling');
        var pos = controlling.obj.position;
        var qat = controlling.obj.quaternion;
        var  up = controlling.obj.up;
        controlling.set(
            {
                position:   pos.toArray(),
                quaternion: qat.toArray(),
                up:          up.toArray(),
            },
            'pushFromThree'
        );
        controlling.save_changes();

        // Also update the target
        this.set({
            target: this.obj.target.toArray(),
        }, 'pushFromThree');
        this.save_changes();
    },
});

module.exports = {
    TrackballControlsModel: TrackballControlsModel,
};
