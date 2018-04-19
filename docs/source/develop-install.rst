
Developer install
=================


To install a developer version of pythreejs, you will first need to clone
the repository::

    git clone https://github.com/jupyter-widgets/pythreejs.git
    cd pythreejs

Next, install it with a develop install using pip::

    pip install -e .


If you are not planning on working on the JS/frontend code, you can
simply install the extensions as you would for a :ref:`normal install<installation>`.
For a JS develop install, you should link your extensions::

    jupyter nbextension install [--sys-prefix / --user / --system] --symlink --py pythreejs

    jupyter nbextension enable [--sys-prefix / --user / --system] --py pythreejs

with the `appropriate flag`_. Or, if you are using Jupyterlab::

    jupyter labextension link ./js


.. links

.. _`appropriate flag`: https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#installing-and-enabling-extensions
