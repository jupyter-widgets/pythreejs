
from traitlets import Bool, validate
from .Material_autogen import Material as MaterialAutogen


class Material(MaterialAutogen):

    # Do not sync this automatically:
    needsUpdate = Bool(False)

    @validate('needsUpdate')
    def onNeedsUpdate(self, proposal):
        if proposal.value:
            content = {
                "type": "needsUpdate",
            }
            self.send(content=content, buffers=None)
        # Never actually set value
        return False
