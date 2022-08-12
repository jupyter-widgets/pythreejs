var TrackballControls = require('../examples/controls/TrackballControls.js').TrackballControls;
var TrackballControlsAutogen = require('./TrackballControls.autogen');

class TrackballControlsModel extends TrackballControlsAutogen.TrackballControlsModel {

    constructThreeObject() {
        var controlling = this.get('controlling');
        var obj = new TrackballControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        obj.noKeys = true; // turn off keyboard navigation

        return obj;
    }

    setupListeners() {
        TrackballControlsAutogen.TrackballControlsModel.prototype.setupListeners.call(this);
        var that = this;
        this.obj.addEventListener('end', function() {
            that.update_controlled();
        });
    }

    update_controlled() {
        // Since TrackballControlsView changes the position of the object,
        // we update the position when we've stopped moving the object.
        // It's probably prohibitive to update it in real-time
        var controlling = this.get('controlling');
        var pos = controlling.obj.position;
        var qat = controlling.obj.quaternion;
        controlling.set(
            {
                position: pos.toArray(),
                quaternion: qat.toArray(),
            },
            'pushFromThree'
        );
        controlling.save_changes();

        // Also update the target
        this.set({
            target: this.obj.target.toArray(),
        }, 'pushFromThree');
        this.save_changes();
    }

}

module.exports = {
    TrackballControlsModel: TrackballControlsModel,
};
