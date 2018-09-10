#ifndef XTHREE_WEBGL_RENDERER_HPP
#define XTHREE_WEBGL_RENDERER_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xrender.hpp"
#include "../scenes/xscene_autogen.hpp"
#include "../cameras/xcamera_autogen.hpp"
#include "../cameras/xperspective_camera_autogen.hpp"

namespace xthree
{
    //
    // xwebgl_renderer declaration
    //
    template <class D>
    class xwebgl_renderer : public xrender_widget<D>
    {
    public:

        using base_type = xrender_widget<D>;
        using derived_type = D;

        void render(scene& s, perspective_camera& c);

        void freeze();
  protected:

        xwebgl_renderer();
        using base_type::base_type;

  private:

        void set_defaults();
    };

    using webgl_renderer = xw::xmaterialize<xwebgl_renderer>;
    using webgl_renderer_generator = xw::xgenerator<xwebgl_renderer>;

    //
    // xwebgl_renderer implementation
    //

    template <class D>
    inline xwebgl_renderer<D>::xwebgl_renderer()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xwebgl_renderer<D>::set_defaults()
    {
        this->_model_name() = "WebGLRendererModel";
        this->_view_name() = "WebGLRendererView";
    }

    template <class D>
    inline void xwebgl_renderer<D>::render(scene& s, perspective_camera& c)
    {
        xeus::xjson content;
        xeus::buffer_sequence buffers;
        content["type"] = "render";

        xeus::xjson scene_content;
        xw::to_json(scene_content, s);
        content["scene"] = scene_content;
        xeus::xjson camera_content;
        xw::to_json(camera_content, c);
        content["camera"] = camera_content;
        this->send(std::move(content), std::move(buffers));
    }

    template <class D>
    inline void xwebgl_renderer<D>::freeze()
    {
        xeus::xjson content;
        xeus::buffer_sequence buffers;
        content["type"] = "freeze";
        this->send(std::move(content), std::move(buffers));
    }
}

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xwebgl_renderer>;
        extern template xw::xmaterialize<xthree::xwebgl_renderer>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xwebgl_renderer>>;
        extern template class xw::xgenerator<xthree::xwebgl_renderer>;
        extern template xw::xgenerator<xthree::xwebgl_renderer>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xwebgl_renderer>>;
    #endif
#endif

#endif