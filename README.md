pythreejs
=========

A Python / ThreeJS bridge utilizing the Jupyter widget infrastructure.

![Screencast](/screencast.gif)

Note
----

This README concerns pythreejs version 0.2.0 beta 2.

Installation
------------

```
pip install --pre pythreejs
jupyter nbextension enable --py pythreejs
```

For a development installation (requires npm),

```
$ git clone https://github.com/jovyan/pythreejs.git
$ cd pythreejs
$ pip install -e .
$ jupyter nbextension install --py --symlink --user pythreejs
$ jupyter nbextension enable --py --user pythreejs
```

Note for developers: the `--symlink` argument on Linux or OS X allows one to
modify the JavaScript code in-place. This feature is not available
with Windows.


