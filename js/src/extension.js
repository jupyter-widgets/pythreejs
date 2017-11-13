// Configure requirejs
if (window.require) {
    window.require.config({
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
