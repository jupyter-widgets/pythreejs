r"""Sage adapters for pythreejs

This is a collection of adapters to create pythreejs graphics from
Sage plot objects (see http://sagemath.org).
"""

# TODO material type option

def create_from_plot(plot):
    tree = plot.scenetree_json()
    obj = sage_handlers[tree['type']](tree)
    cam = PerspectiveCamera(position=[10,10,10], fov=40, up=[0,0,1],
           children=[DirectionalLight(color=0xffffff, position=[3,5,1], intensity=0.5)])
    scene = Scene(children=[obj, AmbientLight(color=0x777777)])
    renderer = Renderer(camera=cam, scene=scene, controls=[OrbitControls(controlling=cam)], color='white')
    return renderer

def json_object(t):
    # TODO make material depend on object type
    if (t['geometry']['type']=='text'):
        mesh = sage_handlers['text'](t)
    elif (t['geometry']['type']=='point'):
        mesh = sage_handlers['point'](t)
    elif (t['geometry']['type']=='line'):
        mesh = sage_handlers['line'](t)
    else:
        m = sage_handlers['texture'](t['texture'])
        g = sage_handlers[t['geometry']['type']](t['geometry'])
        mesh = Mesh(geometry=g, material=m)
        if t.get('mesh',False) is True:
            wireframe_material = BasicMaterial(color=0x222222, transparent=True, opacity=0.2, wireframe=True)
            mesh = Object3d(children=[mesh, Mesh(geometry=g, material=wireframe_material)])
    if t['geometry']['type'] in ('cone', 'cylinder'):
        # Sage assumes the base is on the xy plane and the cylinder axis is parallel to the z-axis
        m = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, t['geometry']['height']/2, 1]
        mesh = Object3d(children=[mesh]).set_matrix(m)
    return mesh

def json_group(t):
    m = t.get('matrix', [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])
    # three.js transformation matrices are the transpose of sage transformations
    m[1], m[2], m[3], m[4], m[6], m[7], m[8], m[9],m[11],m[12],m[13],m[14] = \
    m[4], m[8],m[12], m[1], m[9],m[13], m[2], m[6],m[14], m[3], m[7],m[11]
    children = [sage_handlers[c['type']](c) for c in t['children']]
    return Object3d(children=children).set_matrix(m)

def json_texture(t):
    return PhongMaterial(side='DoubleSide',
                         color = t['color'],
                         opacity = t['opacity'],
                         transparent = t['opacity'] < 1,
                         overdraw=1,
                         polygonOffset=True,
                         polygonOffsetFactor=1,
                         polygonOffsetUnits=1)

def json_box(t):
    return BoxGeometry(width=t['size'][0], 
                        height=t['size'][1], 
                        depth=t['size'][2])

def json_index_face_set(t):
    from itertools import chain
    def flatten(ll):
        return list(chain.from_iterable(ll))
    return FaceGeometry(vertices = flatten(t['vertices']),
                         face3 = flatten(t['face3']),
                         face4 = flatten(t['face4']),
                         facen = t['facen'])

def json_cone(t):
    return CylinderGeometry(radiusTop=0,
                             radiusBottom=t['bottomradius'],
                             height=t['height'],
                             radiusSegments=50)

def json_cylinder(t):
    return CylinderGeometry(radiusTop=t['radius'],
                             radiusBottom=t['radius'],
                             height=t['height'])

def json_sphere(t):
    return SphereGeometry(radius=t['radius'])

def json_line(t):
    tree_geometry = t['geometry']
    m = sage_handlers['texture'](t['texture'])
    mesh = []
    path = [list(p) for p in tree_geometry['points']]
    mesh.append(Mesh(material=m, geometry=TubeGeometry(path=path, radialSegments=50, radius=.01*tree_geometry['thickness'])))
    c = Mesh(material=m, geometry=CircleGeometry(segments=50, radius=.01*tree_geometry['thickness']))
    c.look_at(path[0], path[1])
    c.position = path[0]
    mesh.append(c)
    if (tree_geometry['arrowhead']):
        height = .03*tree_geometry['thickness']
        c = Mesh(material=m, 
                    geometry=CylinderGeometry(radiusTop=0,
                                                 radiusBottom=.02*tree_geometry['thickness'],
                                                 height=height,
                                                 up=[1,0,0],
                                                 radiusSegments=50))
        c.look_at(path[-1], path[-2])
        q1 = c.quaternion
        q2 = [0.7071067811865475, 0.0, 0.0, 0.7071067811865476]
        # http://www.mathworks.com/help/aeroblks/quaternionmultiplication.html
        c.quaternion = [q2[3]*q1[0]+q2[0]*q1[3]-q2[1]*q1[2]+q2[2]*q1[1],
                        q2[3]*q1[1]+q2[0]*q1[2]+q2[1]*q1[3]-q2[2]*q1[0],
                        q2[3]*q1[2]-q2[0]*q1[1]+q2[1]*q1[0]+q2[2]*q1[3],
                        q2[3]*q1[3]-q2[0]*q1[0]-q2[1]*q1[1]-q2[2]*q1[2]]
        p1 = path[-1]
        p2 = path[-2]
        d = [p1[0]-p2[0], p1[1]-p2[1], p1[2]-p2[2]]
        last_seg = sqrt(d[0]*d[0]+d[1]*d[1]+d[2]*d[2])
        adjust_cone = last_seg/(height/2)
        d = [i/adjust_cone for i in d]
        c.position = [p1[0]-d[0], p1[1]-d[1], p1[2]-d[2]]
        d2 = [i*2 for i in d]
        if last_seg>adjust_cone*2:
            # shorten last segment
            mesh[0].geometry.path[-1] = [p1[0]-d2[0], p1[1]-d2[1], p1[2]-d2[2]]
        else:
            # remove last segment
            mesh[0].geometry.path.pop()
            # TODO: keep removing points until we have removed enough that the arrow fits on without
            # seeing the line sticking through the arrow
    else:
        c = Mesh(material=m, geometry=CircleGeometry(segments=50, radius=.01*tree_geometry['thickness']))
        c.look_at(path[-1], path[-2])
        c.position = path[-1]
    mesh.append(c)
    return Object3d(children=mesh)

def json_text(t):
    tree_geometry = t['geometry']
    tree_texture = t['texture']
    tt = TextTexture(string=tree_geometry['string'])
    sm = SpriteMaterial(map=tt, opacity=tree_texture['opacity'], transparent = tree_texture['opacity'] < 1 )
    return Sprite(material=sm, scaleToTexture=True)

def json_point(t):
    g = SphereGeometry(radius=t['geometry']['size'])
    m = sage_handlers['texture'](t['texture'])
    myobject = Mesh(geometry=g, material=m, scale=[.02,.02,.02])
    return ScaledObject(children=[myobject], position = list(t['geometry']['position']))

sage_handlers = {'object' : json_object,
             'group' : json_group,
             'box' : json_box,
             'sphere' : json_sphere,
             'index_face_set' : json_index_face_set,
             'cone' : json_cone,
             'cylinder' : json_cylinder,
             'texture' : json_texture,
             'line' : json_line,
             'text' : json_text,
             'point' : json_point
            }
