//
// Author: @abelnation
// Date: Wed Aug 31 2016 23:46:30 GMT-0700 (PDT)
//

var _ = require('underscore');
var widgets = require('jupyter-js-widgets');
var Promise = require('bluebird');

var WebGLRendererModel = widgets.DOMWidgetModel.extend({
    
    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _view_name: 'WebGLRendererView',
        _model_name: 'WebGLRendererModel',

        width: 200,
        height: 200,
        autoClear: true,
        autoClearColor: true,
        clearColor: '#000000',
        clearOpacity: 1.0,
        autoClearDepth: true,
        autoClearStencil: true,
        sortObject: true,
        clippingPlanes: null,
        localClippingEnabled: false,
        gammaFactor: 2.0,
        gammaInput: false,
        gammaOutput: false,
        physicallyCorrectLights: false,
        toneMappingExposure: 1.0,
        toneMappingWhitePoint: 1.0,
        maxMorphTargets: 8,
        maxMorphNormals: 4,
        // TODO:
        // toneMapping: 'LinearToneMapping',

    }),

}, {
    serializers: _.extend({
        clippingPlanes: { deserialize: widgets.unpack_models },
    }, widgets.DOMWidgetModel.serializers) 
});


var WebGLRendererView = widgets.DOMWidgetView.extend({

    initialize: function(attributes, options) {
        console.log('WebGLRenderer.initialize');

        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);

        this.listenTo(this.model, 'change',            this.onChange.bind(this));
        this.listenTo(this.model, 'change:width',      this.invoke('setSize', ['width', 'height']));
        this.listenTo(this.model, 'change:height',     this.invoke('setSize', ['width', 'height']));
        this.listenTo(this.model, 'change:clearColor', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'change:clearAlpha', this.invoke('setClearColor', ['clearColor', 'clearAlpha']));
        this.listenTo(this.model, 'msg:custom',        this.onCustomMessage.bind(this));

    },

    onChange: function() {
        console.log('WebGLRenderer:change');
    },

    onCustomMessage: function(content, buffers) {
        switch(content.type) {

            case 'render':
                Promise.props({
                    scene: this.objFromCommWidgetId(content.scene),
                    camera: this.objFromCommWidgetId(content.camera),
                }).bind(this).then(function(result) {
                    this.renderScene(result.scene, result.camera);
                });
                break;

            case 'freeze':
                this.freeze();

            default:
                throw new Error('Invalid custom msg type: ' + type);

        }
    },

    objFromCommWidgetId: function(commWidgetId) {
        commWidgetId = commWidgetId.replace('IPY_MODEL_', '');
        var modelPromise = this.model.widget_manager.get_model(commWidgetId);
        return modelPromise.then(function(model) {
            return model.obj;
        });
    },

    render: function() {
        this.renderer = new THREE.WebGLRenderer({
            // required for converting canvas to png
            preserveDrawingBuffer: true,
        });

        this.el.className = "jupytr-widget jupyter-threejs";
        this.$el.empty().append(this.renderer.domElement);

        this.renderer.setSize(this.model.get('width'), this.model.get('height'));

        // TODO: remove camera
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.renderer.domElement.width / this.renderer.domElement.height);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    },

    renderScene: function(scene, camera) {
        console.log("WebGLRenderer.renderScene");
        this.renderer.render(scene, camera);
    },

    freeze: function() {
        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');
    },

    invoke: function(methodName, propNames) {
        var fn = function() {
            args = propNames.map(function(name) {
                return this.model.get(name); 
            }, this);
            this.renderer[methodName].apply(this.renderer, args);
        };
        return fn.bind(this);
    },

});


module.exports = {
    WebGLRendererView: WebGLRendererView,
    WebGLRendererModel: WebGLRendererModel,
};
