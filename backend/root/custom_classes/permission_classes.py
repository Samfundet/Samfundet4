from rest_framework.permissions import DjangoObjectPermissions


class CustomDjangoObjectPermissions(DjangoObjectPermissions):
    """Add django permissions to read methods."""
    DjangoObjectPermissions.perms_map['GET'].append('%(app_label)s.view_%(model_name)s')
    DjangoObjectPermissions.perms_map['HEAD'].append('%(app_label)s.view_%(model_name)s')
