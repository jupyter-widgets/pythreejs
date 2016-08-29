module.exports = {

    // viewName: className + "View",
    // modelName: className + "Model",

    viewSuperClass: 'ThreeView',
    modelSuperClass: 'ThreeModel',
    pySuperClass: 'Widget',

    superDepModuleName: 'base',
    superDepModulePath: './base',

    // properties
    properties: {
        // objPropName: {
        //     default: 100,
        //     type: 'Number',
        //     serialize: false,
        // }
    },

    // ordered list of string names of attributes required by constructor
    constructorArgs: [
        // e.g.: [ 'position', 'scale', 'rotation' ]
    ],


}
