
def pytest_collectstart(collector):
    if collector.fspath and collector.fspath.ext == '.ipynb' and hasattr(collector, 'skip_compare'):
        collector.skip_compare += ('application/vnd.jupyter.widget-view+json', 'text/html')
