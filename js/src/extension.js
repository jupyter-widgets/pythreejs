// Entry point for the notebook bundle containing custom model definitions.

// Configure requirejs
if (window.requirejs) {
    window.requirejs.config({
        map: {
            '*' : {
                'jupyter-threejs': 'nbextensions/jupyter-threejs/index',
                'three': 'nbextensions/jupyter-threejs/three'
            }
        }
    });
}

// Export the required load_ipython_extention
module.exports = {
    load_ipython_extension: function() {}
};
