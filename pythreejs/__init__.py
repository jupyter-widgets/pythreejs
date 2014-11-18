def install_nbextension(**kwargs):
    """Install the appropriate html and javascript into the IPython nbextension.

    Keyword arguments will be passed on to the IPython install_nbextension function.
    """
    import os.path
    from IPython.html import nbextensions
    #kwargs.setdefault('symlink', True)
    pkgdir = os.path.dirname(__file__)
    nbextensions.install_nbextension([os.path.join(pkgdir, 'nbextensions', 'pythreejs')], **kwargs)
