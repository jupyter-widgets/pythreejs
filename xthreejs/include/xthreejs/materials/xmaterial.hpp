#ifndef XTHREE_MATERIAL_HPP
#define XTHREE_MATERIAL_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"
#include "xwidgets/xtransport.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"

#include "xmaterial_autogen.hpp"


namespace xthree
{
    //
    // material declaration
    //

    template<class D>
    class xmaterial : public xmaterial_base<D>
    {
    public:
        using base_type = xmaterial_base<D>;
        using derived_type = D;

        void update();

    protected:

        xmaterial();
        using base_type::base_type;
        
    private:

        void set_defaults();
    };

    using material = xw::xmaterialize<xmaterial>;

    using material_generator = xw::xgenerator<xmaterial>;

    //
    // material implementation
    //

    template <class D>
    inline xmaterial<D>::xmaterial()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xmaterial<D>::set_defaults()
    {
        this->_model_name() = "MaterialModel";
        this->_view_name() = "";
    }

    template <class D>
    inline void xmaterial<D>::update()
    {
        xeus::xjson content;
        xeus::buffer_sequence buffers;
        content["type"] = "needsUpdate";
        this->send(std::move(content), std::move(buffers));
    }

}

xeus::xjson mime_bundle_repr(xthree::material& widget);

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xmaterial>;
        extern template xw::xmaterialize<xthree::xmaterial>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xmaterial>>;
        extern template class xw::xgenerator<xthree::xmaterial>;
        extern template xw::xgenerator<xthree::xmaterial>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xmaterial>>;
    #endif
#endif

#endif