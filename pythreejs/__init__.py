def install_nbextension(**kwargs):
    """Install the appropriate html and javascript into the IPython nbextension.

    Keyword arguments will be passed on to the IPython install_nbextension function.
    """
    import os.path
    from IPython.html import nbextensions
    pkgdir = os.path.dirname(__file__)
    kwargs.setdefault('symlink', True)
    nbextensions.install_nbextension([os.path.join(pkgdir, 'pythreejs')], **kwargs)
