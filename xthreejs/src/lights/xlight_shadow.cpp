#include "xthreejs/lights/xlight_shadow.hpp"

xeus::xjson mime_bundle_repr(xw::xmaterialize<xthree::xlight_shadow>& widget)
{
    if (not widget.pre)
        widget.pre = std::make_shared<xthree::preview>(xthree::preview(widget));
    return mime_bundle_repr(*widget.pre);
}

#ifdef XTHREEJS_PRECOMPILED
    template class xw::xmaterialize<xthree::xlight_shadow>;
    template xw::xmaterialize<xthree::xlight_shadow>::xmaterialize();
    template class xw::xtransport<xw::xmaterialize<xthree::xlight_shadow>>;
    template class xw::xgenerator<xthree::xlight_shadow>;
    template xw::xgenerator<xthree::xlight_shadow>::xgenerator();
    template class xw::xtransport<xw::xgenerator<xthree::xlight_shadow>>;
#endif