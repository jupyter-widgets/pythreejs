"""autodoc extension for traits"""

from collections import OrderedDict

from traitlets import TraitType, Undefined, Container, Dict, Any, HasTraits
from sphinx.ext.autodoc import ClassDocumenter, AttributeDocumenter


def dict_info(trait):
    try:
        trait_base = trait._value_trait
    except AttributeError:
        trait_base = trait._trait
    try:
        traits = trait._per_key_traits
    except AttributeError:
        traits = trait._traits

    if traits is None and (trait_base is None or isinstance(trait_base, Any)):
        value_string = 'elements of any type'
    else:
        parts = []
        if traits:
            parts.append('the following types: %r' % {k: v.info() for k,v in traits})
        if trait_base:
            parts.append('values that are: %s' % trait_base.info())
        value_string = 'elements with ' + ', and '.join(parts)

    return '{} with {}'.format(trait.info(), value_string)


def extended_trait_info(trait):
    if isinstance(trait, Dict):
        return dict_info(trait)
    elif isinstance(trait, Container):
        if trait._trait is None:
            return '{} of any type'.format(trait.info())
        return '{} with values that are: {}'.format(trait.info(), trait._trait.info())
    return trait.info()


class HasTraitsDocumenter(ClassDocumenter):
    """Specialized Documenter subclass for traits"""
    objtype = 'hastraits'
    directivetype = 'class'

    @classmethod
    def can_document_member(cls, member, membername, isattr, parent):
        return isinstance(member, HasTraits)

    def get_object_members(self, want_all):
        """Add traits to members list"""
        check, members = super().get_object_members(want_all)
        get_traits = self.object.class_own_traits if self.options.inherited_members \
                     else self.object.class_traits
        members_new = OrderedDict()
        for m in members:
            members_new[m[0]] = m[1]
        traits = tuple(get_traits().items())
        for name, trait in traits:
            if name not in members_new:
                # Don't add a member that would normally be filtered
                continue
                # pass # FIXME: Debugging

            # put help in __doc__ where autodoc will look for it
            trait.__doc__ = trait.help or extended_trait_info(getattr(self.object, name))
            members_new[name] = trait

        return check, [kv for kv in members_new.items()]


class TraitDocumenter(AttributeDocumenter):
    objtype = 'trait'
    directivetype = 'attribute'
    member_order = 1
    priority = 100

    @classmethod
    def can_document_member(cls, member, membername, isattr, parent):
        return isinstance(member, TraitType)

    def format_name(self):
        return self.objpath[-1]

    def add_directive_header(self, sig):
        default = self.object.default_value
        if default is Undefined:
            default_s = ''
        else:
            default_s = repr(default)
        sig = ' = {}({})'.format(
            self.object.__class__.__name__,
            default_s,
        )
        return super().add_directive_header(sig)


def setup(app):
    app.add_autodocumenter(HasTraitsDocumenter)
    app.add_autodocumenter(TraitDocumenter)
