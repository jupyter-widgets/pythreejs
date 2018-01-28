#ifndef XTHREE_RENDER_HPP
#define XTHREE_RENDER_HPP

#include <string>

#include "xwidgets/xmaterialize.hpp"
#include "xwidgets/xobject.hpp"
#include "xwidgets/xcolor.hpp"
#include "xwidgets/xholder.hpp"

#include "xenums.hpp"
#include "../math/xplane_autogen.hpp"
#include "../renderers/webgl/xwebgl_shadow_map_autogen.hpp"

namespace xthree
{

    //
    // xRenderWidget declaration
    //

    template <class D>
    class xRenderWidget : public xw::xwidget<D>
    {
    public:

        using base_type = xw::xwidget<D>;
        using derived_type = D;

        xeus::xjson get_state() const;
        void apply_patch(const xeus::xjson& patch);

        XPROPERTY(int, derived_type, _width, 200);
        XPROPERTY(int, derived_type, _height, 200);
        XPROPERTY(bool, derived_type, _antialias, false);

        XPROPERTY(bool, derived_type, autoClear, true);
        XPROPERTY(bool, derived_type, autoClearColor, true);
        XPROPERTY(bool, derived_type, autoClearDepth, true);
        XPROPERTY(bool, derived_type, autoClearStencil, true);
        XPROPERTY(std::vector<plane>, derived_type, clippingPlanes);
        XPROPERTY(double, derived_type, gammaFactor, 2.0);
        XPROPERTY(bool, derived_type, gammaInput, false);
        XPROPERTY(bool, derived_type, gammaOutput, false);
        XPROPERTY(bool, derived_type, localClippingEnabled, false);
        XPROPERTY(int, derived_type, maxMorphTargets, 8);
        XPROPERTY(int, derived_type, maxMorphNormals, 4);
        XPROPERTY(bool, derived_type, physicallyCorrectLights, false);
        XPROPERTY(webgl_shadow_map, derived_type, shadowMap, webgl_shadow_map());
        XPROPERTY(bool, derived_type, sortObject, true);
        XPROPERTY(std::string, derived_type, toneMapping, "LinearToneMapping", xenums::ToneMappings);
        XPROPERTY(double, derived_type, toneMappingExposure, 1.0);
        XPROPERTY(double, derived_type, toneMappingWhitePoint, 1.0);

        XPROPERTY(xw::html_color, derived_type, clearColor, "#000000");
        XPROPERTY(double, derived_type, clearOpacity, 1.0);

    protected:

        xRenderWidget();

        using base_type::base_type;

    private:

        void set_defaults();
    };

    //
    // xRenderWidget implementation
    //

    template <class D>
    inline void xRenderWidget<D>::apply_patch(const xeus::xjson& patch)
    {
        base_type::apply_patch(patch);

        XOBJECT_SET_PROPERTY_FROM_PATCH(_width, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(_height, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(_antialias, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(autoClear, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(autoClearColor, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(autoClearDepth, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(autoClearStencil, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(clippingPlanes, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(gammaFactor, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(gammaInput, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(gammaOutput, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(localClippingEnabled, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(maxMorphTargets, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(maxMorphNormals, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(physicallyCorrectLights, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(shadowMap, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(sortObject, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(toneMapping, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(toneMappingExposure, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(toneMappingWhitePoint, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(clearColor, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(clearOpacity, patch);
    }

    template <class D>
    inline xeus::xjson xRenderWidget<D>::get_state() const
    {
        xeus::xjson state = base_type::get_state();

        XOBJECT_SET_PATCH_FROM_PROPERTY(_width, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(_height, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(_antialias, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(autoClear, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(autoClearColor, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(autoClearDepth, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(autoClearStencil, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(clippingPlanes, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(gammaFactor, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(gammaInput, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(gammaOutput, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(localClippingEnabled, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(maxMorphTargets, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(maxMorphNormals, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(physicallyCorrectLights, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(shadowMap, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(sortObject, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(toneMapping, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(toneMappingExposure, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(toneMappingWhitePoint, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(clearColor, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(clearOpacity, state);
        return state;
    }

    template <class D>
    inline xRenderWidget<D>::xRenderWidget()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xRenderWidget<D>::set_defaults()
    {
        this->_model_module() = "jupyter-threejs";
        this->_model_module_version() = "1.0.0-beta.3";
        this->_view_module() = "jupyter-threejs";
        this->_view_module_version() = "1.0.0-beta.3";

    }

    //
    // xPreview declaration
    //

    template <class D>
    class xPreview : public xRenderWidget<D>
    {
    public:

        using base_type = xRenderWidget<D>;
        using derived_type = D;

        using child_type = xw::xholder<xw::xobject>;

        xeus::xjson get_state() const;
        void apply_patch(const xeus::xjson& patch);

        XPROPERTY(bool, derived_type, _flat, false);
        XPROPERTY(bool, derived_type, _wire, false);
        XPROPERTY(child_type, derived_type, child);

        xPreview(const child_type&);

    private:

        void set_defaults();
    };

    using preview = xw::xmaterialize<xPreview>;
    using preview_generator = xw::xgenerator<xPreview>;

    //
    // xPreview implementation
    //

    template <class D>
    inline void xPreview<D>::apply_patch(const xeus::xjson& patch)
    {
        base_type::apply_patch(patch);

        XOBJECT_SET_PROPERTY_FROM_PATCH(_flat, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(_wire, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(child, patch);
    }

    template <class D>
    inline xeus::xjson xPreview<D>::get_state() const
    {
        xeus::xjson state = base_type::get_state();
        XOBJECT_SET_PATCH_FROM_PROPERTY(_flat, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(_wire, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(child, state);
        return state;
    }

    template <class D>
    inline xPreview<D>::xPreview(const child_type& child_)
        : base_type()
    {
        this->child() = child_;
        set_defaults();
    }

    template <class D>
    inline void xPreview<D>::set_defaults()
    {
        this->_model_name() = "PreviewModel";
        this->_view_name() = "PreviewView";
    }
}
#endif