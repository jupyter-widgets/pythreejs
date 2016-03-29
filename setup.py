# -*- coding: utf-8 -*-

from distutils.core import setup
import os

here = os.path.abspath(os.path.dirname(__file__))

version_ns = {}
with open(os.path.join(here, 'pythreejs', '_version.py')) as f:
    exec(f.read(), {}, version_ns)

setup(name='pythreejs',
      version=version_ns['__version__'],
      description='Interactive 3d graphics for the Jupyter notebook, using Three.js from Jupyter interactive widgets.',
      long_description='A Python/ThreeJS bridge utilizing the Jupyter widget infrastructure.',
      author='PyThreejs Development Team',
      author_email='jason@jasongrout.org',
      license='BSD',
      url='https://github.com/jovyan/pythreejs',
      requires=[
          'ipywidgets (>4.1.1)'
          ],
      packages=['pythreejs'],
      package_data={
          'pythreejs': [
              'nbextension/pythreejs.js',
              'nbextension/three.js/*.md',
              'nbextension/three.js/LICENSE',
              'nbextension/three.js/build/three.js',
              'nbextension/three.js/examples/js/*.js',
              'nbextension/three.js/examples/js/controls/*.js',
              'nbextension/three.js/examples/js/renderers/*.js'
          ]
      },
      keywords=['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
      classifiers=[
          'Development Status :: 4 - Beta',
          'Programming Language :: Python'
      ])
