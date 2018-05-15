
pythreejs
=====================================

Version: |release|

**pythreejs** is a `Jupyter widgets`_ based `notebook`_ extension that allows Jupyter to leverage
the WebGL capabilities of modern browsers by creating bindings to the javascript library `three.js`_.


By being based on top of the jupyter-widgets infrastructure, it allows for eased integration
with other interactive tools for notebooks.


Quickstart
----------

To get started with pythreejs, install with pip::

    pip install pythreejs

If you are using a notebook version older than 5.3, or if your kernel is in another environment
than the notebook server, you will also need to register the front-end extensions.

For the notebook front-end::

    jupyter nbextension install [--sys-prefix | --user | --system] --py pythreejs
    jupyter nbextension enable [--sys-prefix | --user | --system] --py pythreejs

For jupyterlab::

    jupyter labextension install jupyter-threejs

.. note::
    If you are installing an older version of pythreejs, you might have to add a version
    specifier for the labextension to match the Python package, e.g. `jupyter-threejs@1.0.0`.


Contents
--------

.. toctree::
   :maxdepth: 2
   :caption: Installation and usage

   installing
   introduction

.. toctree::
   :maxdepth: 1

   examples/index
   api/index


.. toctree::
   :maxdepth: 2
   :caption: Development

   extending
   develop-install


.. links

.. _`Jupyter widgets`: https://jupyter.org/widgets.html

.. _`notebook`: https://jupyter-notebook.readthedocs.io/en/latest/

.. _`three.js`: https://threejs.org/
