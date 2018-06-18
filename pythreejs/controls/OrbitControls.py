from math import pi, sqrt

from ipywidgets import register

from .._base.Three import ThreeWidget
from .OrbitControls_autogen import OrbitControls as OrbitControlsBase


@register
class OrbitControls(OrbitControlsBase):

    def reset(self):
        """Reset the controlled object to its initial state."""
        self.exec_three_obj_method('reset')
