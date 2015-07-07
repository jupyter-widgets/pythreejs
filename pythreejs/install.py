#!/usr/bin/env python

import argparse
from os.path import dirname, abspath, join
try:  # IPython/Jupyter 4.0
    from notebook.nbextensions import install_nbextension
except ImportError:  # IPython 3.x
    from IPython.html.nbextensions import install_nbextension

def install(user=False, symlink=False, **kwargs):
    """Install the pythreejs nbextension.
    
    Parameters
    ----------
    user: bool
        Install for current user instead of system-wide.
    symlink: bool
        Symlink instead of copy (for development).
    **kwargs: keyword arguments
        Other keyword arguments passed to the install_nbextension command
    """
    directory = join(dirname(abspath(__file__)), 'nbextension')
    install_nbextension(directory, destination='pythreejs',
                        symlink=symlink, user=user, **kwargs)

    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Installs the pythreejs widget")
    parser.add_argument("-u", "--user",
                        help="Install as current user instead of system-wide",
                        action="store_true")
    parser.add_argument("-s", "--symlink",
                        help="Symlink instead of copying files",
                        action="store_true")
    args = parser.parse_args()
    install(user=args.user, symlink=args.symlink)