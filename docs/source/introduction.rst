=============
Introduction
=============

The pythreejs API attempts to mimic the three.js API as closely as possible, so
any resource on its API should also be helpful for understanding pythreejs. See for
example the `official three.js documentation`_.

The major difference between the two is the render loop. As we normally do not
want to call back to the kernel for every rendered frame, some helper classes
have been created to allow for user interaction with the scene with minimal
overhead:


Renderer classes
----------------
While the :py:class:`~pythreejs.WebGLRenderer` class mimics its three.js
counterpart in only rendering frames on demand (one frame per call to its
:py:meth:`~pythreejs.WebGLRenderer.render` method), the :py:class:`~pythreejs.Renderer` class
sets up an interactive render loop allowing for `interactive controls`_ and `animation`_.
Similarly, a :py:class:`~pythreejs.Preview` widget allows for a quick visualization of various
threejs objects.


.. _interactive controls:

Interactive controls
--------------------
These are classes for managing user interaction with the WebGL canvas,
and translating that into actions. One example is the :py:class:`~pythreejs.OrbitControls`
class, which allows the user to control the camera by zooming, panning, and orbital rotation
around a target. Another example is the :py:class:`~pythreejs.Picker` widget, which allows
for getting the objects and surface coordinates underneath the mouse cursor.


.. _animation:

Animation views
---------------
The view widgets for the :py:class:`~pythreejs.AnimationAction` class
gives interactive controls to the user for controlling a `threejs animation`_.


-------


Other notable deviations from the threejs API are listed below:

- Buffers are based on `numpy arrays`_, with their inbuilt knowledge of shape and dtype.
  As such, most threejs APIs that take a buffer is slightly modified (fewer options need
  to be specified explicitly).

- The generative geometry objects (e.g. :py:class:`~pythreejs.SphereGeometry` and
  :py:class:`~pythreejs.BoxBufferGeometry`) do not sync their vertices or similar data
  by default. To gain acess to the generated data, convert them to either the
  :py:class:`~pythreejs.Geometry` or :py:class:`~pythreejs.BufferGeometry` type with
  the :py:meth:`~pythreejs.BufferGeometry.from_ref` factory method. See the method
  documentation for further details.

- Methods are often not mirrored to the Python side. However, they can be
  executed with the :py:meth:`~pythreejs.ThreeWidget.exec_three_obj_method` method.
  Consider contributing



.. links

.. _`official three.js documentation`: https://threejs.org/docs/

.. _`threejs animation`: https://threejs.org/docs/#manual/introduction/Animation-system

.. _`numpy arrays`: https://www.numpy.org/
