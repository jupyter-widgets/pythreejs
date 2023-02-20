version_info = (2, 4, 2, 'final')

_specifier_ = {'alpha': 'a', 'beta': 'b', 'candidate': 'rc', 'final': '', 'dev': 'dev'}

postfix = ''
if version_info[3] != 'final':
    if version_info[3] == 'dev' and len(version_info) < 5:
        postfix = 'dev0'
    else:
        postfix = _specifier_[version_info[3]] + str(version_info[4])

__version__ = '%s.%s.%s%s' % (version_info[0], version_info[1], version_info[2], postfix)


# The version of the attribute spec that this package
# implements. This is the value used in
# _model_module_version/_view_module_version.
#
# Update this value when attributes are added/removed from
# the widget models, or if the serialized format changes.
#
# The major version needs to match that of the JS package.
EXTENSION_SPEC_VERSION = '^2.4.1'
