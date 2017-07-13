var _ = require('underscore');

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

function RendererPool() {
    this.numCreated = 0;
    this.freePool = [];
    this.claimedPool = [];
}
_.extend(RendererPool.prototype, {

    acquire: function(onReclaim) {

        var renderer;
        console.log('RendererPool.acquiring...');

        if (this.freePool.length > 0) {

            renderer = this.freePool.shift();

        } else if (this.numCreated < MAX_RENDERERS) {

            renderer = new THREE.WebGLRenderer({
                // required for converting canvas to png
                preserveDrawingBuffer: true,
            });
            renderer.context.canvas.addEventListener("webglcontextlost", this.onContextLost.bind(this), false);
            renderer.poolId = this.numCreated;
            this.numCreated++;


        } else {

            // reclaim token
            var claimedRenderer = this.claimedPool.shift();
            renderer = claimedRenderer.renderer;
            try {
                claimedRenderer.onReclaim();
            } catch (e) {
                // Ensure we do not lose the renderer:
                this.freePool.push(renderer);
                throw e;
            }

        }

        console.log('RendererPool.acquire(id=' + renderer.poolId + ')');
        this.claimedPool.push(makeRendererClaimToken(renderer, onReclaim));
        renderer.clear();
        return renderer;
    },

    release: function(renderer) {
        console.log('RendererPool.release(id=' + renderer.poolId + ')');

        var id = renderer.poolId;
        var claimedRenderer = _.find(this.claimedPool, function(claimToken) {
            return claimToken.renderer.poolId === id;
        });
        if (!claimedRenderer) {
            // Allow redundant release calls
            return;
        }

        // remove claim token
        this.claimedPool = _.without(this.claimedPool, claimedRenderer);
        this.freePool.push(claimedRenderer.renderer);

        // notify holder
        claimedRenderer.onReclaim();

    },

    onContextLost: function(event) {
        // Find the relevant renderer:
        var claim = _.find(this.claimedPool, function(claimToken) {
            return claimToken.renderer.domElement === event.target;
        });
        if (!claim) {
            console.warn('Could not find lost context');
            return;
        }

        // remove claim token
        this.claimedPool = _.without(this.claimedPool, claim);
        this.freePool.push(renderer);

        // notify holder
        claim.onReclaim();
    },

});

module.exports = new RendererPool();