"""
Samf4's organizations, gang types, gangs and sections, as a list kept in code.

`manage.py setup_organizations` creates or updates the database to match this list,
in production too.

Rows are matched by name, so renaming something here creates a new row instead of
renaming the old one. Rename it in the admin first, then here.

Nothing is deleted: a row that is in the database but not here is left alone, and the
command prints it.

DRAFT: copied from the dev seed (seed_scripts/gangs.py). The real structure will be
decided later (WEB-252).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SectionSpec:
    name_nb: str
    name_en: str | None = None  # Defaults to name_nb.


@dataclass(frozen=True)
class GangSpec:
    name_nb: str
    name_en: str | None = None  # Defaults to name_nb.
    abbreviation: str | None = None
    webpage: str | None = None
    sections: tuple[SectionSpec, ...] = ()


@dataclass(frozen=True)
class GangTypeSpec:
    title_nb: str
    title_en: str
    gangs: tuple[GangSpec, ...]


@dataclass(frozen=True)
class OrganizationSpec:
    name: str
    gang_types: tuple[GangTypeSpec, ...] = ()
    # Gangs without a gang type.
    gangs: tuple[GangSpec, ...] = ()

    def all_gangs(self) -> list[tuple[GangTypeSpec | None, GangSpec]]:
        typed: list[tuple[GangTypeSpec | None, GangSpec]] = [(gang_type, gang) for gang_type in self.gang_types for gang in gang_type.gangs]
        return typed + [(None, gang) for gang in self.gangs]


def _sections(*names: str) -> tuple[SectionSpec, ...]:
    return tuple(SectionSpec(name_nb=name) for name in names)


STRUCTURE: tuple[OrganizationSpec, ...] = (
    OrganizationSpec(
        name='Samfundet',
        gang_types=(
            GangTypeSpec(
                title_nb='Arrangerende',
                title_en='Organizing',
                gangs=(
                    GangSpec('Kulturutvalget', abbreviation='KU'),
                    GangSpec('Lørdagskomiteen', abbreviation='LØK'),
                    GangSpec('Klubbstyret', abbreviation='KLST'),
                ),
            ),
            GangTypeSpec(
                title_nb='Drift',
                title_en='Operations',
                gangs=(
                    GangSpec(
                        'Markedsføringsgjengen',
                        abbreviation='MG',
                        sections=_sections('Web', 'Layout', 'Info', 'Marked', 'Redaksjonen', 'STØNT', 'Video'),
                    ),
                    GangSpec('Fotogjengen', abbreviation='FG'),
                    GangSpec('Diversegjengen', abbreviation='DG'),
                    GangSpec('Forsterkerkomiteen', abbreviation='FK'),
                    GangSpec('Regi'),
                    GangSpec('Videokomiteen', abbreviation='VK'),
                ),
            ),
            GangTypeSpec(
                title_nb='Kunstneriske',
                title_en='Artistic',
                gangs=(
                    GangSpec('Studentersamfundets interne teater', abbreviation='SIT'),
                    GangSpec('Studentersamfundets Symfoniorkester', abbreviation='Symforch'),
                    GangSpec('Strindens promenadeorkester', abbreviation='SPO'),
                    GangSpec('Pirum'),
                    GangSpec('Candiss'),
                ),
            ),
            GangTypeSpec(
                title_nb='Styrende',
                title_en='Governing',
                gangs=(
                    GangSpec('Finansstyret', abbreviation='FS'),
                    GangSpec('Styret'),
                    GangSpec('Rådet'),
                ),
            ),
        ),
    ),
    OrganizationSpec(
        name='UKA',
        gangs=(
            GangSpec('Admin', sections=_sections('Digital Innovasjon', 'HMS', 'HR', 'ITK', 'Logistikk', 'Velferd')),
            GangSpec('Arena', sections=_sections('Arrangement', 'Baccarat', 'Serveringen', 'Telt', 'Vertskapet Dødens Dal')),
            GangSpec('Drift', sections=_sections('Byggeprosjektet', 'KSG', 'Selskap', 'Vertskapet Huset')),
            GangSpec('Kultur', sections=_sections('Event', 'FK', 'HusU', 'Regi', 'Revy', 'SaSp', 'VK')),
            GangSpec('PR', sections=_sections('Film og Foto', 'Grafikken', 'Markedsføringen', 'Næringsliv', 'Presse', 'UKEsenderen', 'Profileringen')),
            GangSpec('Økonomi', sections=_sections('Budsjett', 'Regnskap', 'Salget')),
        ),
    ),
    OrganizationSpec(
        name='ISFiT',
        gangs=(
            GangSpec('Admin'),
            GangSpec('Communication'),
            GangSpec('Student Peace Prize', abbreviation='SPP'),
            GangSpec('Culture'),
            GangSpec('Participants'),
            GangSpec('Organizational Resources', abbreviation='OR'),
            GangSpec('Human Resources', abbreviation='HR'),
        ),
    ),
)
