# -*- coding: utf-8 -*-

from setuptools import setup

setup(name = 'pythreejs',
      version = '0.1.0',
      description='Interactive 3d graphics for the Jupyter notebook, using Three.js from IPython widgets.',
      author='PyThreejs Development Team',
      author_email='jason@jasongrout.org',
      license='BSD',
      url='https://github.com/jasongrout/pythreejs',
      install_requires = ['ipython'],
      packages=['pythreejs'],
      include_package_data=True,
      keywords=['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
      classifiers=['Development Status :: 4 - Beta',
                   'Programming Language :: Python'],
      zip_safe=False)
