
.. _installation:

Installation
============


The simplest way to install pythreejs is via pip::

    pip install pythreejs

or via conda::

    conda install pythreejs


With jupyter notebook version >= 5.3, this should also install and enable the
relevant front-end extensions. If for some reason this did not happen
(e.g. if the notebook server is in a different environment than the kernel),
you can install / configure the front-end extensions manually. If you are using classic
notebook (as opposed to Jupyterlab), run::

    jupyter nbextension install [--sys-prefix / --user / --system] --py pythreejs

    jupyter nbextension enable [--sys-prefix / --user / --system] --py pythreejs

with the `appropriate flag`_. If you are using Jupyterlab, install the extension
with::

    jupyter labextension install jupyter-threejs


Upgrading to 1.x
================

If you are upgrading to version 1.x from a verion prior to 1.0, there are certain
backwards-incompatible changes that you should note:

- ``Plain[Buffer]Geometry`` was renamed to ``[Buffer]Geometry``. This was done in
  order to be more consistent with the names used in threejs. The base classes for
  geometry are now called ``Base[Buffer]Geometry``. This also avoids the confusion
  with ``Plane[Buffer]Geometry``.

- ``LambertMaterial -> MeshLambertMaterial``, and other similar material class
  renames were done. Again, this was to more closely match the names used in
  three.js itself.


.. links

.. _`appropriate flag`: https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#installing-and-enabling-extensions
