#ifndef XTHREE_RENDERER_HPP
#define XTHREE_RENDERER_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"
#include "../base/xrender.hpp"
#include "../scenes/xscene_autogen.hpp"
#include "../cameras/xcamera_autogen.hpp"
#include "../controls/xcontrols_autogen.hpp"

namespace xthree
{
    //
    // renderer declaration
    //

    template<class D>
    class xrenderer : public xRenderWidget<D>
    {
    public:

        using base_type = xRenderWidget<D>;
        using derived_type = D;

        xeus::xjson get_state() const;
        void apply_patch(const xeus::xjson& patch);

        XPROPERTY(int, derived_type, width, 200);
        XPROPERTY(int, derived_type, height, 200);
        XPROPERTY(xw::xholder<xscene>, derived_type, scene);
        XPROPERTY(xw::xholder<xcamera>, derived_type, camera);
        XPROPERTY(std::vector<xw::xholder<xcontrols>>, derived_type, controls);
        //XPROPERTY(effect, derived_type, effect = Instance(Effect, allow_none=True).tag(sync=True, **widget_serialization)
        XPROPERTY(xw::html_color, derived_type, background, "black");
        XPROPERTY(double, derived_type, background_opacity, 1.);

    protected:

        xrenderer();

    private:

        void set_defaults();
    };

    using renderer = xw::xmaterialize<xrenderer>;

    using renderer_generator = xw::xgenerator<xrenderer>;

    //
    // renderer implementation
    //

    template <class D>
    inline void xrenderer<D>::apply_patch(const xeus::xjson& patch)
    {
        base_type::apply_patch(patch);

        XOBJECT_SET_PROPERTY_FROM_PATCH(width, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(height, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(scene, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(camera, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(controls, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(background, patch);
        XOBJECT_SET_PROPERTY_FROM_PATCH(background_opacity, patch);
    }

    template <class D>
    inline xeus::xjson xrenderer<D>::get_state() const
    {
        xeus::xjson state = base_type::get_state();

        XOBJECT_SET_PATCH_FROM_PROPERTY(width, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(height, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(scene, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(camera, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(controls, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(background, state);
        XOBJECT_SET_PATCH_FROM_PROPERTY(background_opacity, state);
        return state;
    }

    template <class D>
    inline xrenderer<D>::xrenderer()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xrenderer<D>::set_defaults()
    {
        this->_model_name() = "RendererModel";
        this->_view_name() = "RendererView";
    }
}
#endif