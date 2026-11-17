from __future__ import annotations

from io import StringIO
from collections import Counter

import pytest

from django.core.management import call_command
from django.core.validators import URLValidator

from samfundet.organization.setup import setup_organizations
from samfundet.organization.models import Gang, GangType, GangSection, Organization
from samfundet.organization.structure import STRUCTURE, GangSpec, SectionSpec, GangTypeSpec, OrganizationSpec

SMALL = (
    OrganizationSpec(
        name='Samfundet',
        gang_types=(
            GangTypeSpec(
                title_nb='Drift',
                title_en='Operations',
                gangs=(GangSpec('Markedsføringsgjengen', abbreviation='MG', sections=(SectionSpec('Web'),)),),
            ),
        ),
        gangs=(GangSpec('Styret'),),
    ),
)


class TestStructure:
    """Checks on the real list, so a mistake in it fails CI instead of the deployment."""

    def test_names_are_unique(self) -> None:
        assert len({org.name for org in STRUCTURE}) == len(STRUCTURE)
        for org in STRUCTURE:
            gangs = Counter(gang.name_nb for _, gang in org.all_gangs())
            assert [name for name, count in gangs.items() if count > 1] == [], org.name
            gang_types = Counter(gang_type.title_nb for gang_type in org.gang_types)
            assert [name for name, count in gang_types.items() if count > 1] == [], org.name
            for _, gang in org.all_gangs():
                sections = Counter(section.name_nb for section in gang.sections)
                assert [name for name, count in sections.items() if count > 1] == [], gang.name_nb

    def test_values_fit_the_columns(self) -> None:
        for org in STRUCTURE:
            assert len(org.name) <= Organization._meta.get_field('name').max_length
            for _, gang in org.all_gangs():
                assert len(gang.name_nb) <= Gang._meta.get_field('name_nb').max_length
                assert len(gang.abbreviation or '') <= Gang._meta.get_field('abbreviation').max_length, gang.name_nb

    def test_webpages_are_valid_urls(self) -> None:
        # Gang.save() runs full_clean(), so an address without a scheme, like Samf3's `www.pirum.no`,
        # would stop setup_organizations in production.
        validate = URLValidator()
        for org in STRUCTURE:
            for _, gang in org.all_gangs():
                if gang.webpage:
                    validate(gang.webpage)


@pytest.mark.django_db
class TestSetupOrganizations:
    def test_creates_everything(self) -> None:
        setup_organizations(SMALL)

        mg = Gang.objects.get(name_nb='Markedsføringsgjengen')
        assert mg.organization.name == 'Samfundet'
        assert mg.gang_type.title_en == 'Operations'
        assert mg.name_en == 'Markedsføringsgjengen'
        assert GangSection.objects.get(gang=mg).name_nb == 'Web'
        assert Gang.objects.get(name_nb='Styret').gang_type is None

    def test_running_again_changes_nothing(self) -> None:
        setup_organizations(SMALL)
        report = setup_organizations(SMALL)

        assert report.created == []
        assert report.updated == []
        assert Gang.objects.count() == 2

    def test_updates_changed_values(self) -> None:
        setup_organizations(SMALL)
        Gang.objects.filter(name_nb='Styret').update(abbreviation='OLD')

        report = setup_organizations(SMALL)

        assert report.updated == ['Gang Samfundet, Styret (abbreviation)']
        assert Gang.objects.get(name_nb='Styret').abbreviation is None

    def test_leaves_rows_not_in_the_list_alone(self) -> None:
        setup_organizations(SMALL)
        extra = Gang.objects.create(name_nb='Made in the admin', organization=Organization.objects.get(name='Samfundet'))

        report = setup_organizations(SMALL)

        assert Gang.objects.filter(id=extra.id).exists()
        assert report.not_in_list == [f'Gang {extra}']

    def test_refuses_duplicates(self) -> None:
        setup_organizations(SMALL)
        Gang.objects.create(name_nb='Styret', organization=Organization.objects.get(name='Samfundet'))

        with pytest.raises(ValueError, match='2 rows match Gang'):
            setup_organizations(SMALL)


@pytest.mark.django_db
class TestCommand:
    def test_sets_up_the_real_structure(self) -> None:
        call_command('setup_organizations', stdout=StringIO())

        assert Organization.objects.count() == len(STRUCTURE)
        assert GangType.objects.exists()

    def test_dry_run_saves_nothing(self) -> None:
        out = StringIO()
        call_command('setup_organizations', '--dry-run', stdout=out)

        assert Organization.objects.count() == 0
        assert 'Created Organization Samfundet' in out.getvalue()
