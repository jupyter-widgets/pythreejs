var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');
var $ = require('jquery');
var Promise = require('bluebird');

var pkgName = require('../../package.json').name;
var EXTENSION_SPEC_VERSION = require('../version').EXTENSION_SPEC_VERSION;
var RendererPool = require('./RendererPool');

var ThreeModel = require('./Three').ThreeModel;
var unpackThreeModel = require('./serializers').unpackThreeModel;


class RenderableModel extends widgets.DOMWidgetModel {

    defaults() {
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
    }

    initialize(attributes, options) {
        widgets.DOMWidgetModel.prototype.initialize.apply(this, arguments);

        this.createPropertiesArrays();
        ThreeModel.prototype.setupListeners.call(this);
    }

    createPropertiesArrays() {
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
    }

    onChange(model, options) {
    }

    onChildChanged(model, options) {
        console.debug('child changed: ' + model.model_id);
        // Let listeners (e.g. views) know:
        this.trigger('childchange', this);
    }

    /**
     * Find a view, preferrably a live one
     */
    _findView() {
        var viewPromises = Object.keys(this.views).map(function(key) {
            return this.views[key];
        }, this);
        return Promise.all(viewPromises).then(function(views) {
            for (var i=0; i<views.length; ++i) {
                var view = views[i];
                if (!view.isFrozen) {
                    return view;
                }
            }
            return views[0];
        });
    }

    /**
     * Interface for jupyter-webrtc.
     */
    captureStream(fps) {
        var stream = new MediaStream();

        var that = this;
        var canvasStream = null;

        function updateStream() {
            return that._findView().then(function(view) {
                if (canvasStream !== null) {
                    // Stop and remove tracks from previous canvas
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                        stream.removeTrack(track);
                        canvasStream.removeTrack(track);
                    });
                    canvasStream = null;
                }
                var canvas;
                if (view.isFrozen) {
                    canvas = document.createElement('canvas');
                    canvas.width = view.$frozenRenderer.width();
                    canvas.height = view.$frozenRenderer.height();
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(view.$frozenRenderer[0], 0, 0);
                } else {
                    canvas = view.renderer.domElement;
                }
                // Add tracks from canvas to stream
                canvasStream = canvas.captureStream(fps);
                canvasStream.getTracks().forEach(function(track) {
                    stream.addTrack(track);
                    if (track.requestFrame) {
                        (function() {
                            var orig = track.requestFrame.bind(track);
                            track.requestFrame = function() {
                                orig();
                                // Ensure we redraw to make stream pickup first frame on Chrome
                                // https://bugs.chromium.org/p/chromium/issues/detail?id=903832
                                view.tick();
                            };
                            track.requestFrame();

                        }());
                    }
                });

                // If renderer status changes, update stream
                that.listenToOnce(view, 'updatestream', updateStream);
            });
        }

        return updateStream().then(function() {
            return stream;
        });
    }

}

RenderableModel.serializers = {
    ...widgets.DOMWidgetModel.serializers,
    clippingPlanes: { deserialize: unpackThreeModel },
    shadowMap: { deserialize: unpackThreeModel },
};


class RenderableView extends widgets.DOMWidgetView {

    initialize() {
        widgets.DOMWidgetView.prototype.initialize.apply(this, arguments);

        // starts as "frozen" until renderer is acquired
        this.isFrozen = true;
        this.id = Math.floor(Math.random() * 1000000);
        this._ticking = false;
    }

    remove() {
        super.remove();

        this.$el.empty();
        if (!this.isFrozen) {
            this.teardownViewer();
        }
    }

    _processLuminoMessage(msg, _super) {
        _super.call(this, msg);
        switch (msg.type) {
        case 'after-attach':
            this.el.addEventListener('contextmenu', this, true);
            break;
        case 'before-detach':
            this.el.removeEventListener('contextmenu', this, true);
            break;
        }
    }

    processPhosphorMessage(msg) {
        this._processLuminoMessage(msg, widgets.DOMWidgetView.prototype.processPhosphorMessage);
    }

    processLuminoMessage(msg) {
        this._processLuminoMessage(msg, widgets.DOMWidgetView.prototype.processLuminoMessage);
    }

    handleEvent(event) {
        switch (event.type) {
        case 'contextmenu':
            this.handleContextMenu(event);
            break;
        default:
            widgets.DOMWidgetView.prototype.handleEvent.call(this, event);
            break;
        }
    }

    handleContextMenu(event) {
        // Cancel context menu if on renderer:
        var candidates = [];
        if (this.renderer) {
            candidates.push(this.renderer.domElement);
        }
        if (this.$frozenRenderer) {
            candidates.push(this.$frozenRenderer[0]);
        }
        if (candidates.indexOf(event.target) !== -1) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render() {
        this.doRender();
    }

    doRender() {
        this.el.className = 'jupyter-widget jupyter-threejs';

        this.unfreeze();

        this.lazyRendererSetup();

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.listenTo(this.model, 'rerender',       this.tick.bind(this));
        this.listenTo(this.model, 'msg:custom',     this.onCustomMessage.bind(this));

        this.listenTo(this.model, 'change:_width',  this.updateSize.bind(this));
        this.listenTo(this.model, 'change:_height', this.updateSize.bind(this));
    }

    tick() {
        if (!this._ticking) {
            requestAnimationFrame(this.tock.bind(this));
            this._ticking = true;
        }
    }

    tock() {
        this._ticking = false;
        this.renderScene();
    }

    updateSize() {
        var width = this.model.get('_width');
        var height = this.model.get('_height');
        if (this.isFrozen) {
            // Set size of frozen element
            this.$frozenRenderer.width(width).height(height);
        } else {
            this.renderer.setSize(width, height);
        }
        this.trigger('updatestream');
    }

    updateProperties(force) {
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
    }

    _updateShadowMap(force) {
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
    }

    convertThreeTypeArray(modelArr, propName) {
        return modelArr.map(function(model) {
            return ThreeModel.prototype.convertThreeTypeModelToThree(model, propName);
        }, this);
    }

    renderScene(scene, camera) {
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
    }

    unfreeze() {
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
    }

    acquireRenderer() {

        this.debug('ThreeView.acquiring...');

        var config = {
            antialias: this.model.get('_antialias'),
            alpha: this.model.get('_alpha'),
            webglVersion: this.model.get('_webgl_version'),
        };
        this.renderer = RendererPool.acquire(
            config,
            this.onRendererReclaimed.bind(this));

        this.$renderer = $(this.renderer.domElement);
        this.$el.empty().append(this.$renderer);

        this.$el.css('display', 'block');

        this.updateSize();

        // We need to ensure that renderer properties are applied
        // (we have no idea where the renderer has been...)
        this.updateProperties(true);

        this.debug('ThreeView.acquireRenderer(' + this.renderer.poolId + ')');
    }

    freeze() {
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

    }

    teardownViewer() {

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

    }

    enableControls() {
        this.debug('Enable controls');
        this.boundTick = this.tick.bind(this);
        var that = this;
        this.controls.forEach(function(control) {
            control.enabled = true;
            control.connectEvents(that.$renderer[0]);
            control.addEventListener('change', that.boundTick);
        });
    }

    disableControls() {
        this.debug('Disable controls');
        var that = this;
        this.controls.forEach(function(control) {
            control.enabled = false;
            control.dispose();  // Disconnect from DOM events
            control.removeEventListener('change', that.boundTick);
        });
    }

    onCustomMessage(content, buffers) {
        switch(content.type) {
        case 'freeze':
            this.freeze();
            break;
        default:
        }
    }

    onRendererReclaimed() {
        this.debug('ThreeView WebGL context is being reclaimed: ' + this.renderer.poolId);

        this.freeze();
    }

    log(str) {
        console.log('TV(' + this.id + '): ' + str);
    }

    debug(str) {
        console.debug('TV(' + this.id + '): ' + str);
    }

    lazyRendererSetup() {
        throw new Error('RenderableView should not be used directly, please subclass!');
    }
}


module.exports = {
    RenderableModel: RenderableModel,
    RenderableView: RenderableView,
};
