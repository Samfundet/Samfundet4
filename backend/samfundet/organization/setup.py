"""Applies `structure.STRUCTURE` to the database. Used by `manage.py setup_organizations` and the dev seed."""

from __future__ import annotations

from typing import Any, TypeVar
from dataclasses import field, dataclass

from django.db import models

from .models import Gang, GangType, GangSection, Organization
from .structure import STRUCTURE, OrganizationSpec

M = TypeVar('M', bound=models.Model)


@dataclass
class SetupReport:
    created: list[str] = field(default_factory=list)
    updated: list[str] = field(default_factory=list)
    unchanged: int = 0
    # Rows in the database that the list doesn't mention. They are left alone.
    not_in_list: list[str] = field(default_factory=list)


def _sync(model: type[M], report: SetupReport, *, lookup: dict[str, Any], values: dict[str, Any]) -> M:
    """Find the row matching `lookup`, create it if missing, and set `values` on it if they differ."""
    label = f'{model.__name__} {", ".join(str(value) for value in lookup.values())}'
    matches = list(model.objects.filter(**lookup))
    if len(matches) > 1:
        raise ValueError(f'{len(matches)} rows match {label}. Merge them in the admin, then run again.')

    if not matches:
        obj = model.objects.create(**lookup, **values)
        report.created.append(label)
        return obj

    obj = matches[0]
    changed = [name for name, value in values.items() if getattr(obj, name) != value]
    if changed:
        for name in changed:
            setattr(obj, name, values[name])
        obj.save(update_fields=changed)
        report.updated.append(f'{label} ({", ".join(changed)})')
    else:
        report.unchanged += 1
    return obj


def setup_organizations(structure: tuple[OrganizationSpec, ...] = STRUCTURE) -> SetupReport:
    report = SetupReport()
    seen: list[models.Model] = []

    for org_spec in structure:
        _setup_organization(org_spec, report, seen)

    for model in (Organization, GangType, Gang, GangSection):
        seen_ids = [obj.pk for obj in seen if isinstance(obj, model)]
        report.not_in_list += [f'{model.__name__} {obj}' for obj in model.objects.exclude(pk__in=seen_ids)]

    return report


def _setup_organization(org_spec: OrganizationSpec, report: SetupReport, seen: list[models.Model]) -> None:
    organization = _sync(Organization, report, lookup={'name': org_spec.name}, values={})
    seen.append(organization)

    gang_types: dict[str, GangType] = {}
    for type_spec in org_spec.gang_types:
        gang_types[type_spec.title_nb] = _sync(
            GangType,
            report,
            lookup={'organization': organization, 'title_nb': type_spec.title_nb},
            values={'title_en': type_spec.title_en},
        )
    seen += gang_types.values()

    for gang_type_spec, gang_spec in org_spec.all_gangs():
        gang = _sync(
            Gang,
            report,
            lookup={'organization': organization, 'name_nb': gang_spec.name_nb},
            values={
                'name_en': gang_spec.name_en or gang_spec.name_nb,
                'abbreviation': gang_spec.abbreviation,
                'webpage': gang_spec.webpage,
                'gang_type': gang_types[gang_type_spec.title_nb] if gang_type_spec else None,
            },
        )
        seen.append(gang)
        seen += [
            _sync(
                GangSection,
                report,
                lookup={'gang': gang, 'name_nb': section_spec.name_nb},
                values={'name_en': section_spec.name_en or section_spec.name_nb},
            )
            for section_spec in gang_spec.sections
        ]
