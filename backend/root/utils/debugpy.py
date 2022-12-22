import os

import logging

logger = logging.getLogger('root.utils')


def initialize_debugpy() -> None:
    """
    Injects debugger to running django server.
    Only enabled by setting environment variable ENABLE_DEBUGPY to 'yes'.
    Debugger is available on port 5678.
    This port is also exposed in docker-compose.yml.
    You may connect with for example VSCode, see vscode/launch.json.

    This may be called in wsgi.py if hosting with gunicorn or in manage.py::__main__.
    """
    if os.environ.get('ENABLE_DEBUGPY') == 'True':
        # pylint: disable=import-outside-toplevel
        import debugpy
        host_port = debugpy.listen(('0.0.0.0', 5678))
        logger.info(f'Attached debugpy on {host_port}')
