# mypy: ignore-errors

#
# Handles routing for databases
# (which database should be used for which model)
#
# All models use the default database except billig models
#

from samfundet.models.billig import (
    BilligEvent,
    BilligPriceGroup,
    BilligTicketGroup,
)

# List of models routed to billig database
BILLIG_MODELS = [
    BilligEvent,
    BilligTicketGroup,
    BilligPriceGroup,
]

# List of model names excluded from migrations
BILLIG_MODEL_NAMES = [
    'BilligEvent',
    'BilligTicketGroup',
    'BilligPriceGroup',
]


class SamfundetDatabaseRouter:
    route_app_labels = {'samfundet'}

    def db_for_read(self, model, **hints) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        return None

    def db_for_write(self, model, **hints) -> str | None:
        if model in BILLIG_MODELS:
            return 'billig'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints) -> bool:
        if model_name in BILLIG_MODEL_NAMES:
            return False
        return None
