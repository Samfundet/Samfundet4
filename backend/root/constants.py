class Environment:
    """
    Useful in eg. templates.
    Override in different settings.
    """
    BASE = 'base'
    DEV = 'development'
    HEROKU = 'heroku'
    PROD = 'production'

    ALL = [BASE, DEV, PROD, HEROKU]
    VALID = [DEV, PROD, HEROKU]


# Name of exposed csrf-token header in http traffic.
XCSRFTOKEN = 'X-CSRFToken'
