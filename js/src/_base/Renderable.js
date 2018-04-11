var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');
var Promise = require('bluebird');
var $ = require('jquery');

var THREE = require('three');

var pkgName = require('../../package.json').name;
var EXTENSION_SPEC_VERSION = require('../version').EXTENSION_SPEC_VERSION;
var RendererPool = require('./RendererPool');

var ThreeModel = require('./Three').ThreeModel;

var RenderableModel = widgets.DOMWidgetModel.extend({

    defaults: function() {
        return _.extend(widgets.DOMWidgetModel.prototype.defaults.call(this), {
            _model_module: pkgName,
            _view_module: pkgName,
            _model_module_version: EXTENSION_SPEC_VERSION,
            _model_name: 'RenderableModel',
            _view_name: 'RenderableView',
            _view_module_version: EXTENSION_SPEC_VERSION,

            _width: 200,
            _height: 200,
            _antialias: false,

            autoClear: true,
            autoClearColor: true,
            autoClearDepth: true,
            autoClearStencil: true,
            clippingPlanes: [],
            gammaFactor: 2.0,
            gammaInput: false,
            gammaOutput: false,
            localClippingEnabled: false,
            maxMorphTargets: 8,
            maxMorphNormals: 4,
            physicallyCorrectLights: false,
            shadowMap: null,
            sortObject: true,
            toneMapping: 'LinearToneMapping',
            toneMappingExposure: 1.0,
            toneMappingWhitePoint: 1.0,

            // Properties that are set by functions
            clearColor: '#000000',
            clearOpacity: 1.0,
        });
    },

    initialize: function(attributes, options) {
        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);

        this.createPropertiesArrays();
        ThreeModel.prototype.setupListeners.call(this);
    },

    createPropertiesArrays: function() {
        // This does not inherit ThreeModel, but follow same pattern
        ThreeModel.prototype.createPropertiesArrays.call(this);
        this.three_nested_properties.push('clippingPlanes');
        this.three_properties.push('shadowMap');
        this.props_created_by_three['shadowMap'] = true;

        this.enum_property_types['toneMapping'] = 'ToneMappings';

        this.property_converters['autoClear'] = 'convertBool';
        this.property_converters['autoClearColor'] = 'convertBool';
        this.property_converters['autoClearDepth'] = 'convertBool';
        this.property_converters['autoClearStencil'] = 'convertBool';
        this.property_converters['clippingPlanes'] = 'convertThreeTypeArray';
        this.property_converters['gammaFactor'] = 'convertFloat';
        this.property_converters['gammaInput'] = 'convertBool';
        this.property_converters['gammaOutput'] = 'convertBool';
        this.property_converters['localClippingEnabled'] = 'convertBool';
        this.property_converters['physicallyCorrectLights'] = 'convertBool';
        this.property_converters['sortObjects'] = 'convertBool';
        this.property_converters['toneMapping'] = 'convertEnum';
        this.property_converters['toneMappingExposure'] = 'convertFloat';
        this.property_converters['toneMappingWhitepoint'] = 'convertFloat';
    },

    onChange: function(model, options) {
    },

    onChildChanged: function(model, options) {
        console.debug('child changed: ' + model.model_id);
        // Let listeners (e.g. views) know:
        this.trigger('childchange', this);
    },

}, {
    serializers: _.extend({
        clippingPlanes: { deserialize: widgets.unpack_models },
        shadowMap: { deserialize: widgets.unpack_models },
    }, widgets.DOMWidgetModel.serializers)
});


var RenderableView = widgets.DOMWidgetView.extend({

    initialize: function () {
        widgets.DOMWidgetView.prototype.initialize.apply(this, arguments);

        // starts as "frozen" until renderer is acquired
        this.isFrozen = true;
        this.id = Math.floor(Math.random() * 1000000);
        this._ticking = false;
    },

    remove: function() {
        widgets.DOMWidgetView.prototype.remove.apply(this, arguments);

        this.$el.empty();
        if (!this.isFrozen) {
            this.teardownViewer();
        }
    },

    render: function() {
        this.doRender();
    },

    doRender: function() {
        this.el.className = 'jupyter-widget jupyter-threejs';

        this.unfreeze();

        this.lazyRendererSetup();

        this.setupEventListeners();
    },

    setupEventListeners: function() {
        this.listenTo(this.model, 'rerender',       this.tick.bind(this));
        this.listenTo(this.model, 'msg:custom',     this.onCustomMessage.bind(this));

        this.listenTo(this.model, 'change:_width',  this.updateSize.bind(this));
        this.listenTo(this.model, 'change:_height', this.updateSize.bind(this));
    },

    tick: function() {
        if (!this._ticking) {
            requestAnimationFrame(this.tock.bind(this));
            this._ticking = true;
        }
    },

    tock: function() {
        this._ticking = false;
        this.renderScene();
    },

    updateSize: function() {
        var width = this.model.get('_width');
        var height = this.model.get('_height');
        if (this.isFrozen) {
            // Set size of frozen element
            this.$frozenRenderer.width(width).height(height);
        } else {
            this.renderer.setSize(width, height);
        }
    },

    updateProperties: function(force) {
        if (this.isFrozen) {
            return;
        }
        var model = this.model;

        _.each(model.property_converters, function(converterName, propName) {
            if (!force && !(model._changing && model.hasChanged(propName))) {
                // Only set changed properties unless forced
                return;
            }
            if (!converterName) {
                this.renderer[propName] = this.model.get(propName);
                return;
            }
            var converterFn;
            if (converterName === 'convertThreeTypeArray') {
                converterFn = this[converterName].bind(this);
            } else {
                converterName = converterName + 'ModelToThree';
                converterFn = ThreeModel.prototype[converterName];
            }

            if (!converterFn) {
                throw new Error('invalid converter name: ' + converterName);
            }
            this.renderer[propName] = converterFn(model.get(propName), propName);
        }, this);

        // Deal with shadow map
        this._updateShadowMap(force);

        var clearColor = ThreeModel.prototype.convertColorModelToThree(model.get('clearColor'));
        var clearOpacity = ThreeModel.prototype.convertFloatModelToThree(model.get('clearOpacity'));
        this.renderer.setClearColor(clearColor, clearOpacity);
    },

    _updateShadowMap: function(force) {
        var model = this.model.get('shadowMap');
        var obj = this.renderer.shadowMap;
        var changes = false;
        _.each(model.property_converters, function(converterName, propName) {
            if (!force && !(model._changing && model.hasChanged(propName))) {
                // Only set changed properties unless forced
                return;
            }
            if (!converterName) {
                if (obj[propName] !== this.model.get(propName)) {
                    obj[propName] = this.model.get(propName);
                    changes = true;
                }
                return;
            }
            var converterFn;
            if (converterName === 'convertThreeTypeArray') {
                converterFn = this[converterName].bind(this);
            } else {
                converterName = converterName + 'ModelToThree';
                converterFn = ThreeModel.prototype[converterName];
            }

            if (!converterFn) {
                throw new Error('invalid converter name: ' + converterName);
            }
            var converted = converterFn(model.get(propName), propName);
            if (obj[propName] !== converted) {
                obj[propName] = converted;
                changes = true;
            }
        }, this);
        if (changes) {
            obj.needsUpdate = true;
        }
    },

    convertThreeTypeArray: function(modelArr, propName) {
        return modelArr.map(function(model) {
            return ThreeModel.prototype.convertThreeTypeModelToThree(model, propName);
        }, this);
    },

    renderScene: function(scene, camera) {
        this.debug('renderScene');

        scene = scene || this.scene;
        camera = camera || this.camera;

        if (this.isFrozen) {
            this.unfreeze();
        }

        if (this.renderer.context.isContextLost()) {
            // Context is invalid, freeze for now
            this.freeze();
            return;
        }

        if (scene.ipymodel) {
            scene.ipymodel.trigger('beforeRender', scene, this.renderer, camera);
        }
        this.renderer.render(scene, camera);
        if (scene.ipymodel) {
            scene.ipymodel.trigger('afterRender', scene, this.renderer, camera);
        }
    },

    unfreeze: function() {
        if (!this.isFrozen) {
            return;
        }
        this.debug('unfreeze');

        this.isFrozen = false;

        if(this.$frozenRenderer) {
            this.$frozenRenderer.off('mouseenter');
            this.$frozenRenderer = null;
        }

        this.acquireRenderer();

        if (this.controls) {
            this.enableControls();
        }
    },

    acquireRenderer: function() {

        this.debug('ThreeView.acquiring...');

        var config = {
            antialias: this.model.get('_antialias'),
            alpha: this.model.get('_alpha'),
        };
        this.renderer = RendererPool.acquire(
            config,
            this.onRendererReclaimed.bind(this));

        this.$renderer = $(this.renderer.domElement);
        this.$el.empty().append(this.$renderer);

        this.$el.css('margin-bottom', '-5px');

        this.updateSize();

        this.debug('ThreeView.acquireRenderer(' + this.renderer.poolId + ')');
    },

    freeze: function() {
        if (this.isFrozen) {
            this.log('already frozen...');
            return;
        }

        this.debug('ThreeView.freeze(id=' + this.renderer.poolId + ')');

        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');

        this.teardownViewer();
        this.$frozenRenderer = this.$el.find('img');

        // Ensure the image gets set the right size:
        this.updateSize();

        if (this.controls) {
            this.$frozenRenderer.on('mouseenter', _.bind(function() {
                this.debug('frozenRenderer.mouseenter');
                this.tick(); // renderer will be acquired by renderScene
            }, this));
        }

    },

    teardownViewer: function() {

        this.$renderer.off('mouseenter');
        this.$renderer.off('mouseleave');

        this.isFrozen = true;
        RendererPool.release(this.renderer);

        this.$renderer = null;
        this.renderer = null;

        if (this.controls) {
            this.disableControls();
        }

        this.$el.css('margin-bottom', 'auto');

    },

    enableControls: function() {
        this.debug('Enable controls');
        var that = this;
        this.controls.forEach(function(control) {
            control.enabled = true;
            control.connectEvents(that.$renderer[0]);
            control.addEventListener('change', that.tick.bind(that));
        });
    },

    disableControls: function() {
        this.debug('Disable controls');
        var that = this;
        this.controls.forEach(function(control) {
            control.enabled = false;
            control.dispose();  // Disconnect from DOM events
            control.removeEventListener('change', that.tick.bind(that));
        });
    },

    onCustomMessage: function(content, buffers) {
        switch(content.type) {
        case 'freeze':
            this.freeze();
            break;
        default:
        }
    },

    onRendererReclaimed: function() {
        this.debug('ThreeView WebGL context is being reclaimed: ' + this.renderer.poolId);

        this.freeze();
    },

    log: function(str) {
        console.log('TV(' + this.id + '): ' + str);
    },

    debug: function(str) {
        console.debug('TV(' + this.id + '): ' + str);
    },

    lazyRendererSetup: function() {
        throw new Error('RenderableView should not be used directly, please subclass!');
    }
});


module.exports = {
    RenderableModel: RenderableModel,
    RenderableView: RenderableView,
};
