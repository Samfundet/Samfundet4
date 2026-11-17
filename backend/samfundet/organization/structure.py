"""
Samf4's organizations, gang types, gangs and sections, as a list kept in code.

`manage.py setup_organizations` creates or updates the database to match this list,
in production too.

Rows are matched by name, so renaming something here creates a new row instead of
renaming the old one. Rename it in the admin first, then here.

Nothing is deleted: a row that is in the database but not here is left alone, and the
command prints it.

Samfundet's gang types and gangs are Samf3's groups, as in production on 2026-11-17.
UKA and ISFiT are still a draft copied from the dev seed (seed_scripts/gangs.py).
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
    # Samf3's group types and groups (`group_types` and `groups`), as in production on 2026-11-17,
    # in Samf3's order. Names are spelled as in Samf3. Samf3 has no English names and no sections.
    OrganizationSpec(
        name='Samfundet',
        gang_types=(
            GangTypeSpec(
                title_nb='Styrende organ',
                title_en='Governing bodies',
                gangs=(
                    GangSpec('Finansstyret', abbreviation='FS'),
                    GangSpec('Rådet'),
                    GangSpec('Styret'),
                ),
            ),
            GangTypeSpec(
                title_nb='Arrangerende',
                title_en='Organizing',
                gangs=(
                    GangSpec('Klubbstyret', abbreviation='KLST', webpage='https://klst.samfundet.no/'),
                    GangSpec('Kulturutvalget', abbreviation='KU', webpage='http://ku.samfundet.no/'),
                    GangSpec('Lørdagskomitéen', abbreviation='LØK'),
                ),
            ),
            GangTypeSpec(
                title_nb='Drift',
                title_en='Operations',
                gangs=(
                    GangSpec('Akademisk Radioklubb', abbreviation='ARK', webpage='https://www.la1k.no/'),
                    GangSpec('Diversegjengen', abbreviation='DG', webpage='http://dg.samfundet.no'),
                    GangSpec('Forsterkerkomitéen', abbreviation='FK', webpage='http://fk.samfundet.no'),
                    GangSpec('Fotogjengen', abbreviation='FG', webpage='http://foto.samfundet.no'),
                    GangSpec('IT-komiteen', abbreviation='ITK', webpage='http://itk.samfundet.no'),
                    GangSpec('Kafé- og Serveringsgjengen', abbreviation='KSG', webpage='https://sg.samfundet.no/ekstern/'),
                    GangSpec('Kontrollkontoret', abbreviation='KK'),
                    GangSpec(
                        'Markedsføringsgjengen',
                        abbreviation='MG',
                        # Not from Samf3, which has no sections. Kept from the dev seed.
                        sections=_sections('Web', 'Layout', 'Info', 'Marked', 'Redaksjonen', 'STØNT', 'Video'),
                    ),
                    GangSpec('Profilgruppa', abbreviation='Profil'),
                    GangSpec('Regi', webpage='http://regi.samfundet.no/'),
                    GangSpec('Samfundets Debattkomité', abbreviation='SDK'),
                    GangSpec('Samfundets konsept- og prosjekteringsgruppe', abbreviation='SKP'),
                    GangSpec('Vertskapet', abbreviation='VS'),
                    GangSpec('Videokomitéen', abbreviation='VK', webpage='http://vk.samfundet.no'),
                ),
            ),
            GangTypeSpec(
                title_nb='Kunstneriske',
                title_en='Artistic',
                gangs=(
                    GangSpec("Big Mama's Cowboys"),
                    GangSpec('Blaagress Banden', abbreviation='BB'),
                    GangSpec('Candiss'),
                    GangSpec('Kjellerbandet'),
                    GangSpec('Knauskoret'),
                    GangSpec('Leisure Suit Lovers', abbreviation='LSL', webpage='https://www.leisuresuitlovers.com'),
                    # Samf3 has `www.pirum.no`, without a scheme, which Samf4's URLField rejects.
                    GangSpec('Pirum', webpage='https://www.pirum.no'),
                    GangSpec('S. Møller Storband'),
                    GangSpec('Salongorkestret'),
                    GangSpec('Sitting ducks', abbreviation='SD'),
                    GangSpec('Snaustrinda', webpage='https://snaustrinda.samfundet.no/'),
                    GangSpec('Strindens Promenade Orchester', abbreviation='SPO', webpage='http://www.strindens.no'),
                    GangSpec('Studentersamfundets Interne Teater', abbreviation='SIT', webpage='https://sit.samfundet.no/'),
                    GangSpec('Studentersamfundets Orkester', abbreviation='Låfte'),
                    GangSpec('Studentersamfundets Symfoniorkester', abbreviation='Symforch', webpage='http://www.symforch.no'),
                    GangSpec('Trondhjems Kvinnelige Studentersangforening', abbreviation='TKS'),
                    # Samf3 has `www.mannskor.no`, without a scheme.
                    GangSpec('Trondhjems Studentersangforening', abbreviation='TSS', webpage='https://www.mannskor.no'),
                ),
            ),
            GangTypeSpec(
                title_nb='Media',
                title_en='Media',
                gangs=(
                    GangSpec('Propheten'),
                    GangSpec('Radio Revolt', abbreviation='Radion'),
                    GangSpec('Studentmediene', abbreviation='SM', webpage='http://www.studentmediene.no/'),
                    GangSpec('Under Dusken', abbreviation='UD'),
                    GangSpec('Video Under Dusken'),
                ),
            ),
            GangTypeSpec(
                title_nb='Festivaler',
                title_en='Festivals',
                gangs=(
                    GangSpec('Den Internasjonale Studentfestivalen i Trondheim', abbreviation='ISFiT', webpage='https://www.isfit.org/'),
                    GangSpec('Fadderuke Kickoff', abbreviation='FUK'),
                    GangSpec('UKA'),
                ),
            ),
            GangTypeSpec(
                title_nb='Administrative',
                title_en='Administrative',
                gangs=(
                    GangSpec('Arkivet'),
                    # Samf3 has `gs.samfundet.no`, without a scheme.
                    GangSpec('Gjengsekretariatet', abbreviation='GS', webpage='https://gs.samfundet.no'),
                    GangSpec('Gjengsjefkollegiet', abbreviation='GSK'),
                    GangSpec('Gjengutvalget', abbreviation='GU', webpage='http://gu.samfundet.no'),
                    GangSpec('Nybyggkomitéen', abbreviation='Nybygg'),
                    GangSpec('Samfundets byggekomite', abbreviation='SBK'),
                    GangSpec('Sikringskomiteen'),
                ),
            ),
            GangTypeSpec(
                title_nb='Andre grupperinger',
                title_en='Other groups',
                gangs=(GangSpec('Trondheim InterRail Centre', abbreviation='TIRC'),),
            ),
        ),
    ),
    # UKA and ISFiT are their own organizations in Samf4. Samf3 has them as single groups (under
    # Festivaler above). DRAFT: copied from the dev seed.
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
