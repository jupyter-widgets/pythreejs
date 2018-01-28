#include "xthreejs/core/xobject3d.hpp"

#ifdef XTHREEJS_PRECOMPILED
    template class xw::xmaterialize<xthree::xobject3d>;
    template xw::xmaterialize<xthree::xobject3d>::xmaterialize();
    template class xw::xtransport<xw::xmaterialize<xthree::xobject3d>>;
    template class xw::xgenerator<xthree::xobject3d>;
    template xw::xgenerator<xthree::xobject3d>::xgenerator();
    template class xw::xtransport<xw::xgenerator<xthree::xobject3d>>;
#endif