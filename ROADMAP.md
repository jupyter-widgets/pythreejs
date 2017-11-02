# pythreejs Roadmap

## Ideas

### Cleanup

- Python cleanup
  - Separate sub-sections into own modules
  - Perhaps a simple base class derived from Widget and DOMWidget that takes care of including the npm module name
- JS Cleanup
  - Put widget models and views alongside each other
  - three.js object cache? look up by id/uuid?
  - remove require.js syntax in favor of webpack
  - separate classes into sub-modules, compiled by webpack
- Separate low-level three.js interface from ipython convenience classes
- Experiment with maintaining three.js objects in models instead of classes

### Low-level three.js API

- Separate classes for canvas/webgl renderer?
- BufferGeometry

### High-level ipython convenience API

- Simple default view for any three.js Object3D object that displays object centered with orbit controls?
- TODO

### More examples

- Perhaps broken into separate notebooks
- Test notebook that should be able to execute start to end without errors

### Testing? 

