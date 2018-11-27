
def example_id_gen(max_n=1000):
    for i in range(1, max_n):
        yield 'pythree_example_model_%03d' % (i,)


def use_example_model_ids():
    from ipywidgets import Widget
    old_init = Widget.__init__
    id_gen = example_id_gen()
    def new_init(self, *args, **kwargs):
        kwargs['model_id'] = next(id_gen)
        old_init(self, *args, **kwargs)
    Widget.__init__ = new_init
