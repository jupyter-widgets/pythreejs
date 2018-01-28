#ifndef XTHREE_ANIMATION_ACTION_HPP
#define XTHREE_ANIMATION_ACTION_HPP

#include "xtl/xoptional.hpp"
#include "xwidgets/xeither.hpp"
#include "xwidgets/xwidget.hpp"
#include "xwidgets/xtransport.hpp"

#include "../base/xenums.hpp"
#include "../base/xthree_types.hpp"
#include "../base/xthree.hpp"

namespace xthree
{
    //
    // animation_action declaration
    //

    template<class D>
    class xanimation_action : public xw::xwidget<D>
    {
    public:
        //using base_type_1 = xanimation_action_base<D>;
        using base_type = xw::xwidget<D>;
        using derived_type = D;

        void serialize_state(xeus::xjson&, xeus::buffer_sequence&) const;
        void apply_patch(const xeus::xjson&, const xeus::buffer_sequence&);

        XPROPERTY(xtl::xoptional<xw::xholder<xthree_widget>>, derived_type, mixer);
        XPROPERTY(xtl::xoptional<xw::xholder<xthree_widget>>, derived_type, clip);
        XPROPERTY(xtl::xoptional<xw::xholder<xthree_widget>>, derived_type, localRoot);
        XPROPERTY(bool, derived_type, clampWhenFinished, false);
        XPROPERTY(bool, derived_type, enabled, true);
        XPROPERTY(std::string, derived_type, loop, "LoopRepeat", xenums::LoopModes);
        XPROPERTY(bool, derived_type, paused, false);
        XPROPERTY(int, derived_type, repititions, 1e15);
        XPROPERTY(double, derived_type, time, 0);
        XPROPERTY(double, derived_type, timeScale, 1);
        XPROPERTY(double, derived_type, weigth, 1);
        XPROPERTY(bool, derived_type, zeroSlopeAtEnd, true);
        XPROPERTY(bool, derived_type, zeroSlopeAtStart, true);

        // TODO: add repetitions

    protected:

        xanimation_action();
        using base_type::base_type;

    private:

        void set_defaults();
    };

    using animation_action = xw::xmaterialize<xanimation_action>;

    using animation_action_generator = xw::xgenerator<xanimation_action>;

    //
    // animation_action implementation
    //

    template <class D>
    inline void xanimation_action<D>::serialize_state(xeus::xjson& state, xeus::buffer_sequence& buffers) const
    {
        base_type::serialize_state(state, buffers);

        xw::set_patch_from_property(mixer, state, buffers);
        xw::set_patch_from_property(clip, state, buffers);
        xw::set_patch_from_property(localRoot, state, buffers);
        xw::set_patch_from_property(clampWhenFinished, state, buffers);
        xw::set_patch_from_property(enabled, state, buffers);
        xw::set_patch_from_property(loop, state, buffers);
        xw::set_patch_from_property(paused, state, buffers);
        xw::set_patch_from_property(repititions, state, buffers);
        xw::set_patch_from_property(time, state, buffers);
        xw::set_patch_from_property(timeScale, state, buffers);
        xw::set_patch_from_property(weigth, state, buffers);
        xw::set_patch_from_property(zeroSlopeAtEnd, state, buffers);
        xw::set_patch_from_property(zeroSlopeAtStart, state, buffers);
    }

    template <class D>
    inline void xanimation_action<D>::apply_patch(const xeus::xjson& patch, const xeus::buffer_sequence& buffers)
    {
        base_type::apply_patch(patch, buffers);

        xw::set_property_from_patch(mixer, patch, buffers);
        xw::set_property_from_patch(clip, patch, buffers);
        xw::set_property_from_patch(localRoot, patch, buffers);
        xw::set_property_from_patch(clampWhenFinished, patch, buffers);
        xw::set_property_from_patch(enabled, patch, buffers);
        xw::set_property_from_patch(loop, patch, buffers);
        xw::set_property_from_patch(paused, patch, buffers);
        xw::set_property_from_patch(repititions, patch, buffers);
        xw::set_property_from_patch(time, patch, buffers);
        xw::set_property_from_patch(timeScale, patch, buffers);
        xw::set_property_from_patch(weigth, patch, buffers);
        xw::set_property_from_patch(zeroSlopeAtEnd, patch, buffers);
        xw::set_property_from_patch(zeroSlopeAtStart, patch, buffers);
    }

    template <class D>
    inline xanimation_action<D>::xanimation_action()
        : base_type()
    {
        set_defaults();
    }

    template <class D>
    inline void xanimation_action<D>::set_defaults()
    {
        this->_model_name() = "AnimationActionModel";
        this->_model_module() = "jupyter-threejs";
        this->_model_module_version() = "1.0.0-beta.3";
        this->_view_name() = "AnimationActionView";
        this->_view_module() = "jupyter-threejs";
        this->_view_module_version() = "1.0.0-beta.3";
    }
}

/*********************
 * precompiled types *
 *********************/

#ifdef XTHREEJS_PRECOMPILED
    #ifndef _WIN32
        extern template class xw::xmaterialize<xthree::xanimation_action>;
        extern template xw::xmaterialize<xthree::xanimation_action>::xmaterialize();
        extern template class xw::xtransport<xw::xmaterialize<xthree::xanimation_action>>;
        extern template class xw::xgenerator<xthree::xanimation_action>;
        extern template xw::xgenerator<xthree::xanimation_action>::xgenerator();
        extern template class xw::xtransport<xw::xgenerator<xthree::xanimation_action>>;
    #endif
#endif

#endif