# -*- coding: utf-8 -*-

from distutils.core import setup

setup(name = 'pythreejs',
      version = '0.1.14',
      description='Interactive 3d graphics for the Jupyter notebook, using Three.js from IPython widgets.',
      long_description='A Python/ThreeJS bridge utilizing the IPython widget infrastructure.',
      author='PyThreejs Development Team',
      author_email='jason@jasongrout.org',
      license='BSD',
      url='https://github.com/jasongrout/pythreejs',
      requires = ['ipython'],
      packages=['pythreejs'],
      package_data={'pythreejs': [
      'nbextension/pythreejs.js', 
      'nbextension/three.js/*.md',
      'nbextension/three.js/LICENSE',
      'nbextension/three.js/build/three.js',
      'nbextension/three.js/examples/js/*.js',
      'nbextension/three.js/examples/js/controls/*.js'
      'nbextension/three.js/examples/js/renderers/*.js'
      ]},
      keywords=['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
      classifiers=['Development Status :: 4 - Beta',
                   'Programming Language :: Python']
      )
