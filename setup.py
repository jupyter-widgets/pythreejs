# -*- coding: utf-8 -*-

from __future__ import print_function
import os
import sys

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)

from setuptools import setup


LONG_DESCRIPTION = 'A Python/ThreeJS bridge utilizing the Jupyter widget infrastructure.'

here = os.path.dirname(os.path.abspath(__file__))
name = 'pythreejs'
version = get_version(os.path.join(here, name, '_version.py'))


cmdclass = create_cmdclass(
    'js',
    data_files_spec=[
        ('share/jupyter/nbextensions/jupyter-threejs',
         name + '/static',
         '*.js'),
        ('share/jupyter/nbextensions/jupyter-threejs',
         name + '/static',
         '*.js.map'),
        ('share/jupyter/lab/extensions',
         'js/lab-dist',
         'jupyter-threejs-*.tgz'),
        ('share/jupyter/labextensions/jupyter-threejs/',
         'share/jupyter/labextensions/jupyter-threejs/',
         '*.*'),
        ('share/jupyter/labextensions/jupyter-threejs/static',
         'share/jupyter/labextensions/jupyter-threejs/static/',
         '*.*'),
        ('etc/jupyter/nbconfig',
         'jupyter-config',
         '**/*.json'),
    ],
)
cmdclass['js'] = combine_commands(
    install_npm(
        path=os.path.join(here, 'js'),
        build_dir=os.path.join(here, name, 'static'),
        source_dir=os.path.join(here, 'js'),
        build_cmd='build:all'
    ),
    ensure_targets([
        name + '/static/extension.js',
        name + '/static/index.js',
        'js/src/core/BufferAttribute.autogen.js',
        name + '/core/BufferAttribute_autogen.py',
    ]),
)

setup_args = {
    'name': name,
    'version': version,
    'description': 'Interactive 3d graphics for the Jupyter notebook, using Three.js from Jupyter interactive widgets.',
    'long_description': LONG_DESCRIPTION,
    'license': 'BSD',
    'include_package_data': True,
    'install_requires': [
        'ipywidgets>=7.2.1',
        'ipydatawidgets>=1.1.1',
        'numpy',
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

setup(**setup_args)
