# -*- coding: utf-8 -*-

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(name = 'pythreejs',
      version = '0.1',
      description='Interactive 3d graphics for the Jupyter notebook, using Three.js from IPython widgets.',
      author='PyThreejs Development Team',
      author_email='jason@jasongrout.org',
      license='BSD',
      url='https://github.com/jasongrout/pythreejs',
      install_requires = ['ipywidgets'],
      packages=['pythreejs'],
      include_package_data=True,
      keywords=['ipython', 'jupyter', 'widgets', 'webgl', 'graphics', '3d'],
      zip_safe=False)
