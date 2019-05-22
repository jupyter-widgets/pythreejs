var _ = require('underscore');
var TrackballControls = require('../examples/controls/TrackballControls.js').TrackballControls;
var TrackballControlsAutogen = require('./TrackballControls.autogen');

var dataserializers = require('jupyter-dataserializers');
var serializers = require('../_base/serializers');
var ControlsModel = require('./Controls.autogen.js').ControlsModel;

var TrackballControlsModel = TrackballControlsAutogen.TrackballControlsModel.extend({

    defaults: function() {
        return _.extend(TrackballControlsAutogen.TrackballControlsModel.prototype.defaults.call(this), {
            controlling: null,
        });
    },

    constructThreeObject: function() {
        var controlling = this.get('controlling');
        var obj = new TrackballControls(controlling.obj);
        obj.dispose();  // Disconnect events, we need to (dis-)connect on freeze/thaw
        obj.noKeys = true; // turn off keyboard navigation

        var shaderMaterialModel = this.get('shaderMaterial');
        if (shaderMaterialModel)
            obj.shaderMaterial = shaderMaterial.obj;

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

    onChange: function(model, options) {
        TrackballControlsAutogen.TrackballControlsModel.prototype.onChange.apply(this, arguments);

        // Pass along the possibly changed shaderMaterial we're controlling to the underlying Three object
        var shaderMaterialModel = this.get('shaderMaterial');
        if (shaderMaterialModel)
            this.obj.shaderMaterial = shaderMaterialModel.obj;
    },

    update_controlled: function() {
        // Since TrackballControlsView changes the position of the object,
        // we update the position/target when we've stopped moving the object.
        // It's probably prohibitive to update it in real-time

        // Set the new target
        this.set({
            target: this.obj.target.toArray(),
        }, 'pushFromThree');
        this.save_changes();

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
    },

    createPropertiesArrays: function() {
        TrackballControlsAutogen.TrackballControlsModel.prototype.createPropertiesArrays.call(this);

        this.three_properties.push('shaderMaterial');
        this.property_converters['shaderMaterial'] = 'convertThreeType';
    },
},
{
    // Static members
    serializers: _.extend({
        shaderMaterial: { deserialize: serializers.unpackThreeModel },
    },  ControlsModel.serializers),
});

module.exports = {
    TrackballControlsModel: TrackballControlsModel,
};
