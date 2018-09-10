#ifndef XTHREE_PLANE_HPP
#define XTHREE_PLANE_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"

namespace xthree
{
    //
    // plane declaration
    //

    template<class D>
    class xplane : public xthree_widget<D>
    {
    public:

        using base_type = xthree_widget<D>;
        using derived_type = D;

        void serialize_state(xeus::xjson&, xeus::buffer_sequence&) const;
        void apply_patch(const xeus::xjson&, const xeus::buffer_sequence&);

        XPROPERTY(vector3, derived_type, normal, vector3({0,0,0}));
        XPROPERTY(double, derived_type, constant, 0);

    protected:

        xplane();
        using base_type::base_type;
        
    private:

        void set_defaults();
    };

    using plane = xw::xmaterialize<xplane>;

    using plane_generator = xw::xgenerator<xplane>;

    //
    // plane implementation
    //


    template <class D>
    inline void xplane<D>::serialize_state(xeus::xjson& state, xeus::buffer_sequence& buffers) const
    {
        base_type::serialize_state(state, buffers);

        xw::set_patch_from_property(normal, state, buffers);
        xw::set_patch_from_property(constant, state, buffers);
    }

    template <class D>
    inline void xplane<D>::apply_patch(const xeus::xjson& patch, const xeus::buffer_sequence& buffers)
    {
        base_type::apply_patch(patch, buffers);

        xw::set_property_from_patch(normal, patch, buffers);
        xw::set_property_from_patch(constant, patch, buffers);
    }

    template <class D>
    inline xplane<D>::xplane()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xplane<D>::set_defaults()
    {
        this->_model_name() = "PlaneModel";
        this->_view_name() = "";
    }
}

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xplane>;
        extern template xw::xmaterialize<xthree::xplane>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xplane>>;
        extern template class xw::xgenerator<xthree::xplane>;
        extern template xw::xgenerator<xthree::xplane>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xplane>>;
    #endif
#endif

#endif