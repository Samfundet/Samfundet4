from samfundet.models.general import Organization

ORGANIZATIONS = ['Samfundet', 'ISFiT', 'UKA']


def seed():
    yield 0, 'organizations'
    for index, org in enumerate(ORGANIZATIONS):
        Organization.objects.create(name=org)
        yield index / len(ORGANIZATIONS), 'organizations'
    yield 100, f'Created {len(Organization.objects.all())} organizations'
