r"""
Convenience functions for quickly creating common setups with pythreejs
"""

#
# Lighting Helpers
#

def lights_color():
    return [
        AmbientLight(color=(0.312, 0.188, 0.4)),
        DirectionalLight(position=[1, 0, 1], color=[0.8, 0, 0]),
        DirectionalLight(position=[1, 1, 1], color=[0, 0.8, 0]),
        DirectionalLight(position=[0, 1, 1], color=[0, 0, 0.8]),
        DirectionalLight(position=[-1, -1, -1], color=[.9,.7,.9]),
    ]


def lights_gray():
    return [
        AmbientLight(color=[.6, .6, .6]),
        DirectionalLight(position=[0, 1, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[0, 0, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[1, 1, 1], color=[.5, .5, .5]),
        DirectionalLight(position=[-1, -1, -1], color=[.7,.7,.7]),
    ]

#
# Text
#

def make_text(text, position=(0, 0, 0), height=1):
    """
    Return a text object at the specified location with a given height
    """
    from .objects import Sprite
    from .materials import SpriteMaterial

    sm = SpriteMaterial(map=TextTexture(string=text, color='white', size=100, squareTexture=False))
    return Sprite(material=sm, position = position, scaleToTexture=True, scale=[1, height, 1])

#
# Color maps
#

def height_texture(z, colormap = 'viridis'):
    """Create a texture corresponding to the heights in z and the given colormap."""
    from matplotlib import cm
    from skimage import img_as_ubyte
    import numpy as np
    from .textures import DataTexture

    colormap = cm.get_cmap(colormap)
    im = z.copy()
    # rescale to be in [0,1], scale nan to be the smallest value
    im -= np.nanmin(im)
    im /= np.nanmax(im)
    im = np.nan_to_num(im)

    import warnings
    with warnings.catch_warnings():
        # ignore the precision warning that comes from converting floats to uint8 types
        warnings.filterwarnings('ignore',
                                message='Possible precision loss when converting from',
                                category=UserWarning,
                                module='skimage.util.dtype')
        rgba_im = img_as_ubyte(colormap(im))  # convert the values to rgba image using the colormap

    rgba_list = list(rgba_im.flat)  # make a flat list

    return DataTexture(data=rgba_list, format='RGBAFormat', width=z.shape[1], height=z.shape[0])
