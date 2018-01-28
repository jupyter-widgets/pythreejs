#ifndef XTHREE_OBJECT3D_HPP
#define XTHREE_OBJECT3D_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"
#include "xwidgets/xtransport.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"

#include "xobject3d_autogen.hpp"


namespace xthree
{
    //
    // object3d declaration
    //

    template<class D>
    class xobject3d : public xobject3d_base<D>
    {
    public:
        using base_type = xobject3d_base<D>;
        using derived_type = D;

        template <class T>
        void add(const xthree_widget<T>& w);

        template <class T>
        void add(xthree_widget<T>&& w);

    protected:

        xobject3d();
        using base_type::base_type;

    private:

        void set_defaults();
    };

    using object3d = xw::xmaterialize<xobject3d>;

    using object3d_generator = xw::xgenerator<xobject3d>;

    //
    // object3d implementation
    //

    template <class D>
    inline xobject3d<D>::xobject3d()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xobject3d<D>::set_defaults()
    {
        this->_model_name() = "Object3DModel";
        this->_view_name() = "";
    }

    template <class D>
    template <class T>
    inline void xobject3d<D>::add(const xthree_widget<T>& w)
    {
        this->children().emplace_back(xw::make_id_holder<xthree_widget>(w.id()));
        xeus::xjson state;
        xeus::buffer_sequence buffers;
        xw::set_patch_from_property(this->children, state, buffers);
        this->send_patch(std::move(state), std::move(buffers));
    }

    template <class D>
    template <class T>
    inline void xobject3d<D>::add(xthree_widget<T>&& w)
    {
        this->children().emplace_back(xw::make_owning_holder(std::move(w)));
        xeus::xjson state;
        xeus::buffer_sequence buffers;
        xw::set_patch_from_property(this->children, state, buffers);
        this->send_patch(std::move(state), std::move(buffers));
    }

}

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xobject3d>;
        extern template xw::xmaterialize<xthree::xobject3d>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xobject3d>>;
        extern template class xw::xgenerator<xthree::xobject3d>;
        extern template xw::xgenerator<xthree::xobject3d>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xobject3d>>;
    #endif
#endif

#endif