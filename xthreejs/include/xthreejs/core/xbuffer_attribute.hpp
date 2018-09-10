#ifndef XTHREE_BUFFER_ATTRIBUTE_HPP
#define XTHREE_BUFFER_ATTRIBUTE_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"
#include "../base/xrender.hpp"

namespace xthree
{
    template <class D>
    struct xbuffer_traits;

    //
    // buffer_attribute declaration
    //

    template<class D>
    class xbuffer_attribute : public xthree_widget<D>
    {
    public:

        using base_type = xthree_widget<D>;
        using derived_type = D;

        using value_type = typename xbuffer_traits<derived_type>::value_type;

        void serialize_state(xeus::xjson&, xeus::buffer_sequence&) const;
        void apply_patch(const xeus::xjson&, const xeus::buffer_sequence&);

        XPROPERTY(webgldataunion<value_type>, derived_type, array);
        XPROPERTY(bool, derived_type, dynamic, false);
        XPROPERTY(bool, derived_type, needsUpdate, false);
        XPROPERTY(bool, derived_type, normalized, true);
        XPROPERTY(int, derived_type, version, -1);

        const std::vector<xw::xjson_path_type>& buffer_paths() const;

        std::shared_ptr<xw::xmaterialize<xpreview>> pre = nullptr;

    protected:

        xbuffer_attribute();
        using base_type::base_type;
        
    private:

        void set_defaults();
    };

    template <class T>
    using buffer_attribute = xw::xmaterialize<xbuffer_attribute, T>;

    template <class T>
    using buffer_attribute_generator = xw::xgenerator<xbuffer_attribute, T>;

    template <class T>
    struct xbuffer_traits<buffer_attribute<T>>
    {
        using value_type = T;
    };

    template <class T>
    struct xbuffer_traits<buffer_attribute_generator<T>>
    {
        using value_type = T;
    };

    //
    // buffer_attribute implementation
    //

    template <class D>
    inline const std::vector<xw::xjson_path_type>&  xbuffer_attribute<D>::buffer_paths() const
    {
        static const std::vector<xw::xjson_path_type> default_buffer_paths = { 
            { "array", "buffer" },
        };
        return default_buffer_paths;
    }

    template <class D>
    inline void xbuffer_attribute<D>::serialize_state(xeus::xjson& state, xeus::buffer_sequence& buffers) const
    {
        base_type::serialize_state(state, buffers);

        xw::set_patch_from_property(array, state, buffers);
        xw::set_patch_from_property(dynamic, state, buffers);
        xw::set_patch_from_property(needsUpdate, state, buffers);
        xw::set_patch_from_property(normalized, state, buffers);
        xw::set_patch_from_property(version, state, buffers);
    }

    template <class D>
    inline void xbuffer_attribute<D>::apply_patch(const xeus::xjson& patch, const xeus::buffer_sequence& buffers)
    {
        base_type::apply_patch(patch, buffers);

        xw::set_property_from_patch(array, patch, buffers);
        xw::set_property_from_patch(dynamic, patch, buffers);
        xw::set_property_from_patch(needsUpdate, patch, buffers);
        xw::set_property_from_patch(normalized, patch, buffers);
        xw::set_property_from_patch(version, patch, buffers);
    }

    template <class D>
    inline xbuffer_attribute<D>::xbuffer_attribute()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xbuffer_attribute<D>::set_defaults()
    {
        this->_model_name() = "BufferAttributeModel";
        this->_view_name() = "";
    }
}

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xbuffer_attribute>;
        extern template xw::xmaterialize<xthree::xbuffer_attribute>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xbuffer_attribute>>;
        extern template class xw::xgenerator<xthree::xbuffer_attribute>;
        extern template xw::xgenerator<xthree::xbuffer_attribute>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xbuffer_attribute>>;
    #endif
#endif

#endif