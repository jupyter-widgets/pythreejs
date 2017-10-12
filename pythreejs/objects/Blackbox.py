from .Blackbox_autogen import Blackbox as BaseBlackbox


class Blackbox(BaseBlackbox):
    """A widget with unsynced children.

    This widget allows extension authors to expose scene control
    of a given three object, without attempting to sync its
    children. This makes it possible for a library to give
    access to an outer object, without exposing the full object
    three, and can be useful in avoiding possibly heavy sync
    operations.
    """
    children = None
