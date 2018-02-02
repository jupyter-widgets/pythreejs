
def pytest_collectstart(collector):
    if collector.fspath and collector.fspath.ext == '.ipynb':
        collector.skip_compare += ('application/vnd.jupyter.widget-view+json', 'text/html')
