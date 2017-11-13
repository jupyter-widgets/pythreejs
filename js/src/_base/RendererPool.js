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

function KeyedCollection() {
    this._collection = [];
}
_.extend(KeyedCollection.prototype, {
    push: function(key, value) {
        this._collection.push({key: key, value: value});
    },

    pop: function(key) {
        for (var i=0, l=this._collection.length; i < l; ++i) {
            var el = this._collection[i];
            if (el.key == key) {
                this._collection.splice(i, 1);
                return el.value;
            }
        }
        return null;
    },

    shift: function() {
        var el = this._collection.shift();
        return el.value;
    },

    find: function(evaluator) {
        return _.find(this._collection, function(kv) {
            return evaluator(kv.value);
        });
    },

    popFind: function(evaluator) {
        for (var i=0, l=this._collection.length; i < l; ++i) {
            var el = this._collection[i];
            if (evaluator(el.value)) {
                this._collection.splice(i, 1);
                return el;
            }
        }
        return null;
    },
});

function RendererPool() {
    this.numCreated = 0;
    this.freePool = new KeyedCollection();
    this.claimedPool = new KeyedCollection();
}
_.extend(RendererPool.prototype, {

    _createRenderer: function(config) {
        var renderer = new THREE.WebGLRenderer(
            _.extend({},
                config,
                {
                    // required for converting canvas to png
                    preserveDrawingBuffer: true
                }
            ));
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.context.canvas.addEventListener('webglcontextlost', this.onContextLost.bind(this), false);
        renderer.poolId = this.numCreated;
        this.numCreated++;
        return renderer;
    },

    _replaceRenderer: function(renderer, config) {
        var id = renderer.poolId;
        renderer.dispose();
        this.numCreated--;
        renderer = this._createRenderer(config);
        renderer.poolId = id;
        return renderer;
    },

    acquire: function(config, onReclaim) {

        var renderer;
        console.log('RendererPool.acquiring...');

        if (this.freePool.length > 0) {

            renderer = this.freePool.pop(config);
            if (!renderer) {
                var oldRenderer = this.freePool.shift();
                renderer = this._replaceRenderer(oldRenderer, config);
            }

        } else if (this.numCreated < MAX_RENDERERS) {

            renderer = this._createRenderer(config);

        } else {

            // reclaim token
            var claimedRenderer = this.claimedPool.pop(config);
            var recreate = claimedRenderer === null;
            if (recreate) {
                claimedRenderer = this.claimedPool.shift();
            }
            renderer = claimedRenderer.renderer;
            try {
                claimedRenderer.onReclaim();
            } catch (e) {
                // Ensure we do not lose the renderer:
                this.freePool.push(renderer);
                throw e;
            }
            // Recreate renderer if no appropriate config:
            if (recreate) {
                renderer = this._replaceRenderer(renderer, config);
            }

        }

        // Ensure aliasing state matches, or remake

        console.log('RendererPool.acquire(id=' + renderer.poolId + ')');
        this.claimedPool.push(config, makeRendererClaimToken(renderer, onReclaim));
        renderer.clear();
        return renderer;
    },

    release: function(renderer) {
        console.log('RendererPool.release(id=' + renderer.poolId + ')');

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

    },

    onContextLost: function(event) {
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
    },

});

module.exports = new RendererPool();
