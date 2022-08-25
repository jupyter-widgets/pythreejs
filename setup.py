# -*- coding: utf-8 -*-
from pathlib import Path

HERE = Path(__file__).parent.resolve()

import setupbase

from setupbase import (
    log,
    create_cmdclass,
    install_npm,
    combine_commands,
    ensure_targets,
    get_version,
)
import setuptools

name = 'pythreejs'
py_path = (HERE / name)
js_path = (HERE / "js")
lab_path = (py_path / "labextension")

version = get_version(HERE / name / '_version.py')

cmdclass = create_cmdclass(
    'js',
    data_files_spec=[
        # Support JupyterLab 3.x prebuilt extension
        ("share/jupyter/labextensions/jupyter-threejs", str(lab_path), "**"),
        ("share/jupyter/labextensions/jupyter-threejs", str(HERE), "install.json"),
        # Support JupyterLab 2.x
        ('share/jupyter/lab/extensions', str(js_path/'lab-dist'), 'jupyter-threejs-*.tgz'),
        # Support Jupyter Notebook
        ('etc/jupyter/nbconfig', str(HERE/'jupyter-config'), '**/*.json'),
        ('share/jupyter/nbextensions/jupyter-threejs', str(py_path/'static'), '**/*.js'),
        ('share/jupyter/nbextensions/jupyter-threejs', str(py_path/'static'), '**/*.js.map')
    ],
)
cmdclass['js'] = combine_commands(
    install_npm(
        path=str(js_path),
        build_dir=str(py_path/'static'),
        source_dir=str(js_path),
        build_cmd='build:all'
    ),
    ensure_targets([
        str(py_path/'static'/'extension.js'),
        str(py_path/'static'/'index.js'),
        str(js_path/'src'/'core'/'BufferAttribute.autogen.js'),
        str(py_path/'core'/'BufferAttribute_autogen.py'),
    ]),
)

setup_args = {
    'name': name,
    'version': version,
    'description': (
        'Interactive 3D graphics for the Jupyter Notebook and JupyterLab, '
        'using Three.js and Jupyter Widgets.'
    ),
    'long_description': (HERE / "README.md").read_text(encoding="utf-8"),
    'long_description_content_type': 'text/markdown',
    'license': 'BSD-3-Clause',
    'include_package_data': True,
    'python_requires': '>=3.7',
    'install_requires': [
        'ipywidgets>=7.2.1',
        'ipydatawidgets>=1.1.1',
        'numpy',
        'traitlets',
    ],
    'extras_require': {
        'test': [
            'nbval',
            'pytest-check-links',
            'numpy>=1.14',
        ],
        'examples': [
            'scipy',
            'matplotlib',
            'scikit-image',
            'ipywebrtc',
        ],
        'docs': [
            'sphinx>=1.5',
            'nbsphinx>=0.2.13',
            'nbsphinx-link',
            'sphinx-rtd-theme',
        ]
    },
    'packages': [name],  # Manually specify here, update after autogen
    'zip_safe': False,
    'cmdclass': cmdclass,
    'author': 'PyThreejs Development Team',
    'author_email': 'jason@jasongrout.org',
    'url': 'https://github.com/jupyter-widgets/pythreejs',
    'keywords': ['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
    'classifiers': [
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 3',
        'Programming Language :: JavaScript',
    ],
}


if __name__ == "__main__":
    setuptools.setup(**setup_args)
