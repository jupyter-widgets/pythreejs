# -*- coding: utf-8 -*-
from __future__ import print_function
from setuptools import setup
try:
    from jupyterpip import cmdclass
except:
    import pip, importlib
    pip.main(['install', 'jupyter-pip']); cmdclass = importlib.import_module('jupyterpip').cmdclass

setup(
    name='pythreejs',
    version='0.1',
    url='https://github.com/jasongrout/pythreejs',
    packages=['pythreejs'],
    include_package_data=True,
    install_requires=["jupyter-pip"],
    cmdclass=cmdclass('pythreejs'),
    zip_safe=False,
)
