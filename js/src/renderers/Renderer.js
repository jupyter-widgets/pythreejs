var widgets = require('jupyter-js-widgets');
var THREE = require('three');

var base = require('../base');

var RendererView = widgets.DOMWidgetView.extend({

    render : function() {

        console.log('created renderer');
        var that = this;

        this.on('displayed', this.show, this);
        this.id = widgets.uuid();

        var render_loop = {

            register_update: function(fn, context) {
                that.on('animate:update', fn, context);
            },

            render_frame: function () {
                that._render = true;
                that.schedule_update();
            },

            renderer_id: this.id

        };

        if (Detector.webgl) {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
        } else {
            this.renderer = new THREE.CanvasRenderer();
        }

        this.el.className = "jupyter-widget jupyter-threejs";
        this.$el.empty().append(this.renderer.domElement);

        // Create camera and scene views
        var view_promises = [];
        view_promises.push(this.create_child_view(this.model.get('camera'), render_loop).then(
            function(view) {
                that.camera = view;
            }));
        view_promises.push(this.create_child_view(this.model.get('scene'), render_loop).then(
            function(view) {
                that.scene = view;
            }));

        // Handle effect views, if any
        var effect_promise;
        if (this.model.get('effect')) {
            effect_promise = this.create_child_view(this.model.get('effect'), {
                renderer: this.renderer
            }).then(function(view) {
                that.effectrenderer = view.obj;
            })
        } else {
            effect_promise = Promise.resolve(this.renderer).then(function(r) {
                that.effectrenderer = r;
            });
        }
        effect_promise = effect_promise.then(function() {
            that.effectrenderer.setSize(that.model.get('width'), that.model.get('height'));
            that.effectrenderer.setClearColor(that.model.get('background'), that.model.get('background_opacity'))
        });
        view_promises.push(effect_promise);

        // Wait on all view promises
        this.view_promises = Promise.all(view_promises).then(function(objs) {
            that.scene.obj.add(that.camera.obj);
            console.log('renderer', that.model, that.scene.obj, that.camera.obj);
            that.update();
            that._animation_frame = false;
            var controls = _.map(that.model.get('controls'), function(m) {
                return that.create_child_view(m, _.extend({}, {
                    dom: that.renderer.domElement,
                    start_update_loop: function() {
                        that._update_loop = true;
                        that.schedule_update();
                    },
                    end_update_loop: function() {
                        that._update_loop = false;
                    },
                    renderer: that
                }, render_loop))
            }, that);
            return Promise.all(controls)
                .then(function(c) {
                    that.controls = c;
                })
                .then(function() {
                    that._render = true;
                    that.schedule_update();
                    window.r = that;
                });
        });

        return this.view_promises;

    },

    schedule_update: function() {

        if (!this._animation_frame) {
            this._animation_frame = requestAnimationFrame(_.bind(this.animate, this))
        }

    },

    animate: function() {
        
        this._animation_frame = false;
        if (this._update_loop) {
            this.schedule_update();
        }
        this.trigger('animate:update', this);
        if (this._render) {
            this.effectrenderer.render(this.scene.obj, this.camera.obj)
            this._render = false;
        }

    },

    update: function() {

        var that = this;
        this.view_promises.then(function() {
            that.effectrenderer.setSize(that.model.get('width'), that.model.get('height'));
            that.effectrenderer.setClearColor(that.model.get('background'), that.model.get('background_opacity'));
        });

        widgets.DOMWidgetView.prototype.update.call(that);

    },
});


var RendererModel = base.ThreeModel.extend({

    defaults: _.extend({}, base.ThreeModel.prototype.defaults, {
        _view_name: 'RendererView',
        _model_name: 'RendererModel',

        width: 600,
        height: 100,
        renderer_type: 'auto',
        scene: undefined,
        camera: undefined,
        controls: [],
        effect: null,
        background: 'black',
        background_opacity: 0.0
    })

}, {

    serializers: _.extend({
        scene: { deserialize: widgets.unpack_models },
        camera: { deserialize: widgets.unpack_models },
        controls: { deserialize: widgets.unpack_models },
        effect: { deserialize: widgets.unpack_models }
    }, base.ThreeModel.serializers)

});



module.exports = {
    RendererView: RendererView,
    RendererModel: RendererModel,
};
