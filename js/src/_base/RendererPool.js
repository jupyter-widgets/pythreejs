var _ = require('underscore');

var THREE = require('three');

// This should be available for most devices:
var MAX_RENDERERS = 8;


function makeRendererClaimToken(renderer, onReclaim) {
    return {
        id: renderer.poolId,
        claimTime: new Date(),
        renderer: renderer,
        onReclaim: onReclaim,
    };
}

class KeyedCollection {
    constructor() {
        this._collection = [];
    }

    push(key, value) {
        this._collection.push({key: key, value: value});
    }

    pop(key) {
        for (var i=0, l=this._collection.length; i < l; ++i) {
            var el = this._collection[i];
            if (_.isEqual(el.key, key)) {
                this._collection.splice(i, 1);
                return el.value;
            }
        }
        return null;
    }

    shift() {
        var el = this._collection.shift();
        return el.value;
    }

    find(evaluator) {
        return _.find(this._collection, function(kv) {
            return evaluator(kv.value);
        });
    }

    popFind(evaluator) {
        for (var i=0, l=this._collection.length; i < l; ++i) {
            var el = this._collection[i];
            if (evaluator(el.value)) {
                this._collection.splice(i, 1);
                return el;
            }
        }
        return null;
    }

    length() {
        return this._collection.length;
    }
}

var isWebgl2Available = (function() {
    var isAvailable;
    function inner() {
        if (isAvailable === undefined) {
            try {
                var canvas = document.createElement( 'canvas' );
                isAvailable = !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );
            } catch ( e ) {
                isAvailable = false;
            }
        }
        return isAvailable;
    }
    return inner;
})();

class RendererPool {
    constructor() {
        this.numCreated = 0;
        this.freePool = new KeyedCollection();
        this.claimedPool = new KeyedCollection();
    }

    _createRenderer(config) {
        config = _.extend({}, config);
        var webglVersion = config.webglVersion;
        delete config.webglVersion;

        if (webglVersion === 2 && isWebgl2Available()) {
            // We need to map the right config for the context ourselves:
            var canvas = document.createElement('canvas');
            config =_.extend({
                depth: true,
                stencil: true,
                premultipliedAlpha: true,
                preserveDrawingBuffer: true,
                powerPreference: 'default'
            }, config);
            var context = canvas.getContext('webgl2', config);
            config.canvas = canvas;
            config.context = context;
        }

        var renderer = new THREE.WebGLRenderer({
            ...config,
            // required for converting canvas to png
            preserveDrawingBuffer: true
        });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.context.canvas.addEventListener('webglcontextlost', this.onContextLost.bind(this), false);
        renderer.poolId = this.numCreated;
        this.numCreated++;
        return renderer;
    }

    _replaceRenderer(renderer, config) {
        var id = renderer.poolId;
        renderer.dispose();
        this.numCreated--;
        renderer = this._createRenderer(config);
        renderer.poolId = id;
        return renderer;
    }

    acquire(config, onReclaim) {

        var renderer;
        console.debug('RendererPool.acquiring...');

        if (this.freePool.length() > 0) {
            // We have one or more free renderers
            // (previously used renderers that have been released)

            var freeToken = this.freePool.pop(config);
            if (freeToken) {
                // We have a free renderer with the correct config
                renderer = freeToken.renderer;
            } else {
                // We need to replace one of the free renderers to get
                // the right config:
                freeToken = this.freePool.shift();
                renderer = this._replaceRenderer(freeToken.renderer, config);
            }

        } else if (this.numCreated < MAX_RENDERERS) {

            // We have not yet reached max capacity, create a new renderer:
            renderer = this._createRenderer(config);

        } else {

            // reclaim token
            var claimedToken = this.claimedPool.pop(config);
            var recreate = claimedToken === null;
            if (recreate) {
                claimedToken = this.claimedPool.shift();
            }
            renderer = claimedToken.renderer;
            try {
                claimedToken.onReclaim();
            } catch (e) {
                // Ensure we do not lose the renderer:
                this.freePool.push(null, renderer);
                throw e;
            }
            // Recreate renderer if no appropriate config:
            if (recreate) {
                renderer = this._replaceRenderer(claimedToken.renderer, config);
            }

        }

        console.debug('RendererPool.acquire(id=' + renderer.poolId + ')');
        this.claimedPool.push(config, makeRendererClaimToken(renderer, onReclaim));
        renderer.clear();
        return renderer;
    }

    release(renderer) {
        console.debug('RendererPool.release(id=' + renderer.poolId + ')');

        var id = renderer.poolId;
        var kvPair = this.claimedPool.popFind(function(claimToken) {
            return claimToken.renderer.poolId === id;
        });
        if (!kvPair) {
            // Allow redundant release calls
            return;
        }

        // move renderer to free pool
        this.freePool.push(kvPair.key, kvPair.value);

        // notify previous claimant
        kvPair.value.onReclaim();

    }

    onContextLost(event) {
        // Find the relevant renderer, and remove claim:
        var kvPair = this.claimedPool.popFind(function(claimToken) {
            return claimToken.renderer.domElement === event.target;
        });
        if (!kvPair) {
            console.warn('Could not find lost context');
            return;
        }

        // move renderer to free pool
        this.freePool.push(kvPair.key, kvPair.value);

        // notify previous claimant
        kvPair.value.onReclaim();
    }

}

module.exports = new RendererPool();
