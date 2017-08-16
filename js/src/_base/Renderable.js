var _ = require('underscore');
var widgets = require("@jupyter-widgets/base");
var Promise = require('bluebird');
var $ = require('jquery');

var pkgName = require('../../package.json').name;
var RendererPool = require('./RendererPool');

var RenderableModel = widgets.DOMWidgetModel.extend({

    defaults: function() {
        return _.extend(widgets.DOMWidgetModel.prototype.defaults.call(this), {
            _model_module: pkgName,
            _view_module: pkgName,
            _model_name: 'RenderableModel',
            _view_name: 'RenderableView',

            _width: 200,
            _height: 200,
        });
    },

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
        this.el.className = "jupyter-widget jupyter-threejs";

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
        if (this.animate) {
            this.tick();
        }
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

    renderScene: function(scene, camera) {
        this.log('renderScene');

        scene = scene || this.scene;
        camera = camera || this.camera;

        if (this.isFrozen) {
            this.unfreeze();
        }

        if (this.renderer.context.isContextLost()) {
            // Context is invalid, freeze for now (stops animation etc)
            this.freeze();
            return;
        }

        this.renderer.render(scene, camera);
    },

    unfreeze: function() {
        if (!this.isFrozen) {
            return;
        }
        this.log('unfreeze');

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

        this.log('ThreeView.acquiring...');

        this.renderer = RendererPool.acquire(this.onRendererReclaimed.bind(this));

        this.$renderer = $(this.renderer.domElement);
        this.$el.empty().append(this.$renderer);

        this.$el.css('margin-bottom', '-5px');

        this.updateSize();

        this.log('ThreeView.acquireRenderer(' + this.renderer.poolId + ')');
    },

    freeze: function() {
        if (this.isFrozen) {
            this.log('already frozen...');
            return;
        }

        this.log('ThreeView.freeze(id=' + this.renderer.poolId + ')');

        this.animate = false;
        this.$el.empty().append('<img src="' + this.renderer.domElement.toDataURL() + '" />');

        this.teardownViewer();
        this.$frozenRenderer = this.$el.find('img');

        // Ensure the image gets set the right size:
        this.updateSize();

        if (this.controls) {
            this.$frozenRenderer.on('mouseenter', _.bind(function() {
                this.log('frozenRenderer.mouseenter');
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
        this.log('Enable controls');
        var that = this;
        this.controls.forEach(function(control) {
            control.enabled = true;
            control.connectEvents(that.$renderer[0]);
            control.addEventListener('change', that.tick.bind(that));
        });
    },

    disableControls: function() {
        this.log('Disable controls');
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
        this.log('ThreeView WebGL context is being reclaimed: ' + this.renderer.poolId);

        this.freeze();
    },

    log: function(str) {
        console.log('TV(' + this.id + '): ' + str);
    },

    lazyRendererSetup: function() {
        throw new Error('RenderableView should not be used directly, please subclass!');
    }
});


module.exports = {
    RenderableModel: RenderableModel,
    RenderableView: RenderableView,
};
