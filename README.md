# pythreejs

[![Install from PyPI][pypi-badge]][pypi]
[![Install from conda-forge][cf-badge]][cf]
[![Documentation Status][docs-badge]][docs]
[![Build Status][ci-badge]][ci]

A Python / ThreeJS bridge for [Jupyter Widgets][widgets].

[pypi-badge]: https://img.shields.io/pypi/v/pythreejs?logo=pypi
[pypi]: https://pypi.org/project/pythreejs
[cf-badge]: https://img.shields.io/conda/vn/conda-forge/pythreejs?logo=conda-forge
[cf]: https://anaconda.org/conda-forge/pythreejs
[docs-badge]: https://readthedocs.org/projects/pythreejs/badge/?version=stable
[docs]: https://pythreejs.readthedocs.io/en/stable
[ci-badge]: https://github.com/jupyter-widgets/pythreejs/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/jupyter-widgets/pythreejs/actions/workflows/ci.yml?query=branch%3Amaster
[widgets]: https://jupyter.org/widgets

![Screencast](screencast.gif)

## Installation

Using `pip`:

```bash
pip install pythreejs
```

or `conda`:

```bash
conda install -c conda-forge pythreejs
```

> For a development install, see the [contributing guide][contributing].

The extension should then be installed automatically for your Jupyter client.

> For JupyterLab `<3`, you may also need to ensure `nodejs` is installed, and
> rebuild the application:
>
> ```bash
> # conda install -c cond-forge 'nodejs>=12'
> jupyter lab build
> ```

[contributing]: https://github.com/jupyter-widgets/pythreejs/blob/master/CONTRIBUTING.md

## Troubleshooting

If the extension is not automatically installed, you can manually enable it

### Jupyter Notebook Classic

```bash
jupyter nbextension list
jupyter nbextension install --py --symlink --sys-prefix pythreejs
jupyter nbextension enable --py --sys-prefix pythreejs
jupyter nbextension list
```

You should see:

```bash
Known nbextensions:
  ...
  jupyter-js-widgets/extension  enabled
    - Validating: OK
```

> Note for developers: the `--symlink` argument on Linux or MacOS allows one to
> modify the JavaScript code in-place. This feature is not available on Windows.

### JupyterLab

To perform a _source installation_:

```bash
## ensure you have nodejs install, e.g. with conda
# conda install -c conda-forge 'nodejs>=12'
jupyter labextension list
jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager
jupyter labextension install --no-build jupyter-datawidgets/extension
jupyter labextension install jupyter-threejs
jupyter labextension list
```

You should see:

```bash
JupyterLab v...
  ...
    jupyterlab-datawidgets v... enabled OK
    @jupyter-widgets/jupyterlab-manager v... enabled OK
    jupyter-threejs v... enabled OK

```

> This approach is _not recommended_ for JupyterLab 3, which enables
> _federated modules_, installed via `pip`, `conda` or other package managers,
> and does not require rebuilding the entire application.

## Uninstallation

Using `pip`:

```bash
pip uninstall pythreejs
```

or `conda`:

```bash
conda uninstall pythreejs
```

> If you applied any manual steps above, it may be necessary to remove the

### Jupyter Notebook Classic

```bash
jupyter nbextension disable --py --sys-prefix pythreejs
```

### Jupyter Lab

```bash
jupyter labextension uninstall jupyter-threejs
```

## Open Source

This software is licensed under the [BSD-3-Clause][] License.

[bsd-3-clause]: https://github.com/jupyter-widgets/pythreejs/blob/master/LICENSE
