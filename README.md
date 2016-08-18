pythreejs
=========

A Python / ThreeJS bridge utilizing the Jupyter widget infrastructure.

![Screencast](/screencast.gif)


Installation
------------

Using pip:

```
pip install pythreejs
jupyter nbextension enable --py --sys-prefix pythreejs
```

Using conda

```
$ conda install -c conda-forge pythreejs
```

For a development installation (requires npm):

```
$ git clone https://github.com/jovyan/pythreejs.git
$ cd pythreejs
$ pip install -e .
$ jupyter nbextension install --py --symlink --sys-prefix pythreejs
$ jupyter nbextension enable --py --sys-prefix pythreejs
```

Note for developers: the `--symlink` argument on Linux or OS X allows one to
modify the JavaScript code in-place. This feature is not available
with Windows.


