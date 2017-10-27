# -*- coding: utf-8 -*-

from __future__ import print_function
from setuptools import setup, find_packages
import os
import sys

from setupbase import (
    create_cmdclass,
    install_npm,
)


from distutils import log
log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

LONG_DESCRIPTION = 'A Python/ThreeJS bridge utilizing the Jupyter widget infrastructure.'


here = os.path.abspath(os.path.dirname(sys.argv[0]))


version_ns = {}
with open(os.path.join(here, 'pythreejs', '_version.py')) as f:
    exec(f.read(), {}, version_ns)


cmdclass = create_cmdclass(['js'])
cmdclass['js'] = install_npm(
    path=os.path.join(here, 'js'),
    build_dir=os.path.join(here, 'pythreejs', 'static'),
    source_dir=os.path.join(here, 'js'),
)

setup_args = {
    'name': 'pythreejs',
    'version': version_ns['__version__'],
    'description': 'Interactive 3d graphics for the Jupyter notebook, using Three.js from Jupyter interactive widgets.',
    'long_description': LONG_DESCRIPTION,
    'License': 'BSD',
    'include_package_data': True,
    'data_files': [
        ('share/jupyter/nbextensions/jupyter-threejs', [
            'pythreejs/static/extension.js',
            'pythreejs/static/index.js',
            'pythreejs/static/index.js.map',
        ]),
    ],
    'install_requires': ['ipywidgets>=7,<8', 'numpy', 'traittypes'],
    'packages': find_packages(),
    'zip_safe': False,
    'cmdclass': cmdclass,
    'author': 'PyThreejs Development Team',
    'author_email': 'jason@jasongrout.org',
    'url': 'https://github.com/jovyan/pythreejs',
    'keywords': ['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
    'classifiers': [
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
    ],
}

setup(**setup_args)
