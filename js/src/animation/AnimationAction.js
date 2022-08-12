var _ = require('underscore');
var widgets = require('@jupyter-widgets/base');
var utils = require('../_base/utils');
var Promise = require('bluebird');
var AnimationActionAutogen = require('./AnimationAction.autogen').AnimationActionModel;

var THREE = require('three');

var pkgName = require('../../package.json').name;

class AnimationActionModel extends AnimationActionAutogen {

    defaults() {
        return _.extend(
            AnimationActionAutogen.prototype.defaults.call(this),
            widgets.DOMWidgetModel.prototype.defaults.call(this),
            {
                _view_module: pkgName,
                _view_name: 'AnimationActionView',
            });
    }

    createPropertiesArrays() {
        AnimationActionAutogen.prototype.createPropertiesArrays.call(this);

        // Prevent from syncing these to object
        delete this.property_converters['mixer'];
        delete this.property_converters['clip'];
        delete this.property_converters['localRoot'];
    }

    constructThreeObject() {
        // Use mixer.clipAction() instead of constructor for cache
        // (according to THREE docs)
        var mixer = this.convertThreeTypeModelToThree(this.get('mixer'), 'mixer');
        var rootObj = this.convertThreeTypeModelToThree(this.get('localRoot'), 'localRoot');
        var result = mixer.clipAction(
            this.convertThreeTypeModelToThree(this.get('clip'), 'clip'),
            rootObj
        );
        rootObj.animations = (rootObj.animations || []);
        rootObj.animations.push(result);
        this.timer = new THREE.Clock();
        return Promise.resolve(result);
    }

    play() {
        this.obj.play();
        this.timer.start();
        this.obj.paused = false;

        var root = this.get('localRoot');
        var scene = utils.getModelScene(root);
        if (scene) {
            this.listenTo(scene, 'afterRender', this.animateFrame.bind(this));
        }
        this.animateFrame();
        this.syncAnimationState();
    }

    syncAnimationState() {
        var root = this.get('localRoot');
        var mixer = this.get('mixer');
        root.syncToModel(true);
        mixer.syncToModel(true);
        this.syncToModel(true);
    }

    animateFrame() {
        var mixer = this.get('mixer').obj;
        var delta = this.timer.getDelta();
        mixer.update(delta);
        // As long as root is in scene, this will trigger a re-render
        // The onAfterRender will then trigger a new frame
        var scene = utils.getModelScene(this.get('localRoot'));
        if (scene) {
            scene.trigger('rerender', this, {});
        }
    }

    pause() {
        this.obj.paused = true;
        this.resetRenderHook();
        this.timer.stop();
        this.syncAnimationState();
    }

    stop() {
        this.obj.stop();
        this.resetRenderHook();
        this.timer.stop();
        this.syncAnimationState();
    }

    repeat() {
        this.obj.reset();
        this.obj.play();
    }

    resetRenderHook() {
        var scene = utils.getModelScene(this.get('localRoot'));
        if (scene) {
            this.stopListening(scene, 'afterRender');
        }
    }

    onCustomMessage(content, buffers) {
        switch(content.type) {
        case 'play':
            this.play();
            break;
        case 'pause':
            this.pause();
            break;
        case 'stop':
            this.stop();
            break;
        default:
            AnimationActionAutogen.prototype.onCustomMessage.call(arguments);
        }
    }

}

AnimationActionModel.serializers = {
    ...AnimationActionAutogen.serializers,
    ...widgets.DOMWidgetModel.serializers,
};


class AnimationActionView extends widgets.DOMWidgetView {

    render() {
        widgets.DOMWidgetView.prototype.render();
        this.el.classList.add('jupyter-widgets');
        this.el.classList.add('widget-inline-hbox');
        this.el.classList.add('widget-play');

        this.playButton = document.createElement('button');
        this.pauseButton = document.createElement('button');
        this.stopButton = document.createElement('button');
        this.repeatButton = document.createElement('button');

        this.playButton.className = 'jupyter-button';
        this.pauseButton.className = 'jupyter-button';
        this.stopButton.className = 'jupyter-button';
        this.repeatButton.className = 'jupyter-button';

        this.el.appendChild(this.playButton);  // Toggle button with playing
        this.el.appendChild(this.pauseButton); // Disable if not playing
        this.el.appendChild(this.stopButton);  // Disable if not playing
        this.el.appendChild(this.repeatButton);  // Always enabled, but may be hidden

        var playIcon = document.createElement('i');
        playIcon.className = 'fa fa-play';
        this.playButton.appendChild(playIcon);
        var pauseIcon = document.createElement('i');
        pauseIcon.className = 'fa fa-pause';
        this.pauseButton.appendChild(pauseIcon);
        var stopIcon = document.createElement('i');
        stopIcon.className = 'fa fa-stop';
        this.stopButton.appendChild(stopIcon);
        var repeatIcon = document.createElement('i');
        repeatIcon.className = 'fa fa-retweet';
        this.repeatButton.appendChild(repeatIcon);

        this.model.initPromise.bind(this).then(function() {

            this.playButton.onclick = this.model.play.bind(this.model);
            this.pauseButton.onclick = this.model.pause.bind(this.model);
            this.stopButton.onclick = this.model.stop.bind(this.model);
            this.repeatButton.onclick = this.model.repeat.bind(this.model);

            this.listenTo(this.model, 'change:_playing', this.update_playing);
            this.listenTo(this.model, 'change:_repeat', this.update_repeat);
            this.listenTo(this.model, 'change:show_repeat', this.update_repeat);
            this.update_playing();
            this.update_repeat();
            this.update();
        });
    }

    update() {
        var disabled = !this.model.get('enabled');
        this.playButton.disabled = disabled;
        this.pauseButton.disabled = disabled;
        this.stopButton.disabled = disabled;
        this.repeatButton.disabled = disabled;
        this.update_playing();
    }

    update_playing() {
        var playing = !this.model.get('paused');
        var disabled = !this.model.get('enabled');
        if (playing) {
            if (!disabled) {
                this.pauseButton.disabled = false;
            }
            this.playButton.classList.add('mod-active');
        } else {
            if (!disabled) {
                this.pauseButton.disabled = true;
            }
            this.playButton.classList.remove('mod-active');
        }
    }

    update_repeat() {
        // TODO: Add loop/repetition modifiers
        // LoopOnce/LoopRepeate/LoopPingPong
        // Zero slope at end
        var repeat = this.model.get('_repeat');
        if (repeat) {
            this.repeatButton.classList.add('mod-active');
        } else {
            this.repeatButton.classList.remove('mod-active');
        }
    }
}

module.exports = {
    AnimationActionModel: AnimationActionModel,
    AnimationActionView: AnimationActionView,
};
