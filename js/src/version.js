
// Copyright (c) pythreejs Developers.
// Distributed under the terms of the Modified BSD License.

/**
 * The version of the attribute spec that this package
 * implements. This is the value used in
 * _model_module_version/_view_module_version.
 *
 * Update this value when attributes are added/removed from
 * the widget models, or if the serialized format changes.
 */
module.exports['EXTENSION_SPEC_VERSION'] = '^2.0.0';

// Export widget models and views, and the npm package version number.
module.exports['version'] = require('../package.json').version;
