# imports
import os

from root.constants import Environment
# End: imports -----------------------------------------------------

ENV = os.environ.get('ENV')

# Raise exception if ENV is invalid (and show possible options).
if ENV not in Environment.VALID:
    ENV_OPTIONS = ''.join([f'\n\t{env}' for env in Environment.VALID])
    raise Exception(f"Environment variable 'ENV' is required to import this module ('{__name__}')."
                    f'Possible values: {ENV_OPTIONS}')

if ENV == Environment.DEV:
    from .dev import *  # noqa: F403,F401
elif ENV == Environment.PROD:
    from .prod import *  # type: ignore # noqa: F403,F401
