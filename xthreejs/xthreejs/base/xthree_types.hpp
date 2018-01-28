#ifndef XTHREE_THREE_TYPES_HPP
#define XTHREE_THREE_TYPES_HPP

#include <array>

namespace xthree{
    using vector2 = std::array<double, 2>;
    using vector3 = std::array<double, 3>;
    using vector4 = std::array<double, 4>;

    using matrix3 = std::array<double, 9>;
    using matrix4 = std::array<double, 16>;
}

#endif
