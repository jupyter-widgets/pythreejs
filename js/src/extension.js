// Entry point for the notebook bundle containing custom model definitions.
//
// Setup notebook base URL
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/jupyter-threejs/';


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
