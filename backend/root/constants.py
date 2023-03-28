class Environment:
    """
    Useful in eg. templates.
    Override in different settings.
    """
    BASE = 'base'
    DEV = 'development'
    PROD = 'production'

    ALL = [BASE, DEV, PROD]
    VALID = [DEV, PROD]


# Name of exposed csrf-token header in http traffic.
XCSRFTOKEN = 'X-CSRFToken'
