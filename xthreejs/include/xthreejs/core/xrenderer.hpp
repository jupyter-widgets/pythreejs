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
    class xrenderer : public xrender_widget<D>
    {
    public:

        using base_type = xrender_widget<D>;
        using derived_type = D;

        void serialize_state(xeus::xjson&, xeus::buffer_sequence&) const;
        void apply_patch(const xeus::xjson&, const xeus::buffer_sequence&);

        XPROPERTY(int, derived_type, _width, 200);
        XPROPERTY(int, derived_type, _height, 200);
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
    inline void xrenderer<D>::apply_patch(const xeus::xjson& patch, const xeus::buffer_sequence& buffers)
    {
        base_type::apply_patch(patch, buffers);

        xw::set_property_from_patch(_width, patch, buffers);
        xw::set_property_from_patch(_height, patch, buffers);
        xw::set_property_from_patch(scene, patch, buffers);
        xw::set_property_from_patch(camera, patch, buffers);
        xw::set_property_from_patch(controls, patch, buffers);
        xw::set_property_from_patch(background, patch, buffers);
        xw::set_property_from_patch(background_opacity, patch, buffers);
    }

    template <class D>
    inline void xrenderer<D>::serialize_state(xeus::xjson& state, xeus::buffer_sequence& buffers) const
    {
        base_type::serialize_state(state, buffers);

        xw::set_patch_from_property(_width, state, buffers);
        xw::set_patch_from_property(_height, state, buffers);
        xw::set_patch_from_property(scene, state, buffers);
        xw::set_patch_from_property(camera, state, buffers);
        xw::set_patch_from_property(controls, state, buffers);
        xw::set_patch_from_property(background, state, buffers);
        xw::set_patch_from_property(background_opacity, state, buffers);
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

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xrenderer>;
        extern template xw::xmaterialize<xthree::xrenderer>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xrenderer>>;
        extern template class xw::xgenerator<xthree::xrenderer>;
        extern template xw::xgenerator<xthree::xrenderer>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xrenderer>>;
    #endif
#endif

#endif