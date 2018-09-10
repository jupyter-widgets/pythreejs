#include "xthreejs/base/xthree_types.hpp"

template<>
std::string xthree::webgldataunion<float>::type2str() const
{
    return "float32";
}

template<>
std::string xthree::webgldataunion<int>::type2str() const
{
    return "int32";
}

template<>
std::string xthree::webgldataunion<unsigned int>::type2str() const
{
    return "uint32";
}

template<>
std::string xthree::webgldataunion<short>::type2str() const
{
    return "int16";
}

template<>
std::string xthree::webgldataunion<unsigned short>::type2str() const
{
    return "uint16";
}

template<>
std::string xthree::webgldataunion<char>::type2str() const
{
    return "uint8";
}
