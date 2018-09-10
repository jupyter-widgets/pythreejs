#include "xthreejs/math/xplane.hpp"

#ifdef XTHREEJS_PRECOMPILED
    template class xw::xmaterialize<xthree::xplane>;
    template xw::xmaterialize<xthree::xplane>::xmaterialize();
    template class xw::xtransport<xw::xmaterialize<xthree::xplane>>;
    template class xw::xgenerator<xthree::xplane>;
    template xw::xgenerator<xthree::xplane>::xgenerator();
    template class xw::xtransport<xw::xgenerator<xthree::xplane>>;
#endif