var OrbitControls = require('../examples/controls/OrbitControls.js').OrbitControls;
var OrbitControlsAutogen = require('./OrbitControls.autogen');


class OrbitControlsModel extends OrbitControlsAutogen.OrbitControlsModel {

    constructThreeObject() {
        var controlling = this.get('controlling');
        var obj = new OrbitControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        obj.enableKeys = false; // turn off keyboard navigation

        return obj;
    }

    setupListeners() {
        OrbitControlsAutogen.OrbitControlsModel.prototype.setupListeners.call(this);
        var that = this;
        this.obj.addEventListener('end', function() {
            that.update_controlled();
        });
    }

    update_controlled() {
        // Since OrbitControls changes the position of the object, we
        // update the position when we've stopped moving the object.
        // It's probably prohibitive to update it in real-time
        var controlling = this.get('controlling');
        var pos = controlling.obj.position;
        var qat = controlling.obj.quaternion;
        controlling.set(
            {
                position: pos.toArray(),
                quaternion: qat.toArray(),
                zoom: controlling.obj.zoom,
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
    OrbitControlsModel: OrbitControlsModel,
};
