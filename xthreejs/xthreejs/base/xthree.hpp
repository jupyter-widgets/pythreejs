#ifndef XTHREE_THREE_HPP
#define XTHREE_THREE_HPP

#include <string>

#include "xwidgets/xmaterialize.hpp"
#include "xwidgets/xobject.hpp"

namespace xthree
{

    //
    // xthree_widget declaration
    //

    template <class D>
    class xthree_widget : public xw::xobject<D>
    {
    public:

        using base_type = xw::xobject<D>;
        using derived_type = D;

        xeus::xjson get_state() const;
        void apply_patch(const xeus::xjson& patch);

    protected:

        xthree_widget();

        using base_type::base_type;

    private:

        bool _previewable = true;
        void set_defaults();
    };

    using three_widget = xw::xmaterialize<xthree_widget>;
    using three_widget_generator = xw::xgenerator<xthree_widget>;

    //
    // xthree_widget implementation
    //

    template <class D>
    inline void xthree_widget<D>::apply_patch(const xeus::xjson& patch)
    {
        base_type::apply_patch(patch);
    }

    template <class D>
    inline xeus::xjson xthree_widget<D>::get_state() const
    {
        return base_type::get_state();
    }

    template <class D>
    inline xthree_widget<D>::xthree_widget()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xthree_widget<D>::set_defaults()
    {
        this->_model_module() = "jupyter-threejs";
        this->_model_module_version() = "1.0.0-beta.3";
        this->_view_module() = "";
        this->_view_module_version() = "";
    }
}
#endif