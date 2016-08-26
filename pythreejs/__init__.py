from ._version import version_info, __version__
from ._package import npm_pkg_name, py_pkg_name

from .core import *
from .cameras import *
from .controls import *
from .effects import *
from .extras import *
from .lights import *
from .materials import *
from .objects import *
from .scenes import *
from .textures import *
from .renderers import *
from .helpers import *


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': npm_pkg_name,
        'require': npm_pkg_name + '/extension'
    }]
