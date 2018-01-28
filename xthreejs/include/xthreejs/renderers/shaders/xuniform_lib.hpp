#ifndef XTHREE_UNIFORMLIB_HPP
#define XTHREE_UNIFORMLIB_HPP

#include <xeus/xjson.hpp>

namespace xthree
{
    static auto xuniform_lib = R"(
{
    "common": {
        "diffuse": {
            "value": 15658734
        },
        "opacity": {
            "value": 1
        },
        "map": {
            "value": null
        },
        "uvTransform": {
            "value": {
                "elements": [
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1
                ]
            }
        },
        "alphaMap": {
            "value": null
        }
    },
    "specularmap": {
        "specularMap": {
            "value": null
        }
    },
    "envmap": {
        "envMap": {
            "value": null
        },
        "flipEnvMap": {
            "value": -1
        },
        "reflectivity": {
            "value": 1
        },
        "refractionRatio": {
            "value": 0.98
        }
    },
    "aomap": {
        "aoMap": {
            "value": null
        },
        "aoMapIntensity": {
            "value": 1
        }
    },
    "lightmap": {
        "lightMap": {
            "value": null
        },
        "lightMapIntensity": {
            "value": 1
        }
    },
    "emissivemap": {
        "emissiveMap": {
            "value": null
        }
    },
    "bumpmap": {
        "bumpMap": {
            "value": null
        },
        "bumpScale": {
            "value": 1
        }
    },
    "normalmap": {
        "normalMap": {
            "value": null
        },
        "normalScale": {
            "value": {
                "x": 1,
                "y": 1
            }
        }
    },
    "displacementmap": {
        "displacementMap": {
            "value": null
        },
        "displacementScale": {
            "value": 1
        },
        "displacementBias": {
            "value": 0
        }
    },
    "roughnessmap": {
        "roughnessMap": {
            "value": null
        }
    },
    "metalnessmap": {
        "metalnessMap": {
            "value": null
        }
    },
    "gradientmap": {
        "gradientMap": {
            "value": null
        }
    },
    "fog": {
        "fogDensity": {
            "value": 0.00025
        },
        "fogNear": {
            "value": 1
        },
        "fogFar": {
            "value": 2000
        },
        "fogColor": {
            "value": 16777215
        }
    },
    "lights": {
        "ambientLightColor": {
            "value": []
        },
        "directionalLights": {
            "value": [],
            "properties": {
                "direction": {},
                "color": {},
                "shadow": {},
                "shadowBias": {},
                "shadowRadius": {},
                "shadowMapSize": {}
            }
        },
        "directionalShadowMap": {
            "value": []
        },
        "directionalShadowMatrix": {
            "value": []
        },
        "spotLights": {
            "value": [],
            "properties": {
                "color": {},
                "position": {},
                "direction": {},
                "distance": {},
                "coneCos": {},
                "penumbraCos": {},
                "decay": {},
                "shadow": {},
                "shadowBias": {},
                "shadowRadius": {},
                "shadowMapSize": {}
            }
        },
        "spotShadowMap": {
            "value": []
        },
        "spotShadowMatrix": {
            "value": []
        },
        "pointLights": {
            "value": [],
            "properties": {
                "color": {},
                "position": {},
                "decay": {},
                "distance": {},
                "shadow": {},
                "shadowBias": {},
                "shadowRadius": {},
                "shadowMapSize": {},
                "shadowCameraNear": {},
                "shadowCameraFar": {}
            }
        },
        "pointShadowMap": {
            "value": []
        },
        "pointShadowMatrix": {
            "value": []
        },
        "hemisphereLights": {
            "value": [],
            "properties": {
                "direction": {},
                "skyColor": {},
                "groundColor": {}
            }
        },
        "rectAreaLights": {
            "value": [],
            "properties": {
                "color": {},
                "position": {},
                "width": {},
                "height": {}
            }
        }
    },
    "points": {
        "diffuse": {
            "value": 15658734
        },
        "opacity": {
            "value": 1
        },
        "size": {
            "value": 1
        },
        "scale": {
            "value": 1
        },
        "map": {
            "value": null
        },
        "uvTransform": {
            "value": {
                "elements": [
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1
                ]
            }
        }
    }
}
    )"_json;
}
#endif