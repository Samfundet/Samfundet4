import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '~/Components';
import { useGetInfoPageOwnerOptions } from '~/domain';
import type { GangDto, GangSectionDto, InformationPageOwnerOptionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT, formatGangName, formatSectionName, lowerCapitalize } from '~/utils';
import styles from './OwnerField.module.scss';

export type Owner = { type: 'gang'; id: number } | { type: 'section'; id: number };

type OwnerFieldProps = {
  currentGang?: GangDto | null;
  currentSection?: GangSectionDto | null;
  value?: Owner;
  disabled?: boolean;
  onChange: (owner: Owner | undefined) => void;
};

// TODO: we could probably make this component generic and move it to ~/Components for later re-use, such
//  as for the recruitment system, which basically needs the exact same functionality
export function OwnerField({ currentGang, currentSection, value, onChange, disabled }: OwnerFieldProps) {
  const { t } = useTranslation();

  const { data: ownerOptions } = useGetInfoPageOwnerOptions();
  const options = ownerOptions ?? [];

  const current = currentSection
    ? { type: 'section' as const, id: currentSection.id }
    : currentGang
      ? { type: 'gang' as const, id: currentGang.id }
      : undefined;

  const creatable = options.filter((option) => option.can_create);
  const onlyChoice = !current && creatable.length === 1 ? ownerOf(creatable[0]) : undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: onChange is recreated every render
  useEffect(() => {
    if (onlyChoice && !sameOwner(value, onlyChoice)) {
      onChange(onlyChoice);
    }
  }, [onlyChoice, value]);

  if (current) {
    const currentOption = options.find((option) => sameOwner(ownerOf(option), current));
    const canMove = Boolean(currentOption?.can_change && currentOption?.can_delete);

    if (!canMove) {
      return <OwnerLabel value={currentOption ? flatLabel(currentOption) : localLabel(currentGang, currentSection)} />;
    }

    return <OwnerDropdown options={options} value={value ?? current} onChange={onChange} disabled={disabled} />;
  }

  if (creatable.length <= 1) {
    return <OwnerLabel value={creatable[0] ? flatLabel(creatable[0]) : '—'} />;
  }

  return (
    <OwnerDropdown
      options={options}
      value={value}
      onChange={onChange}
      placeholder={lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.owner)}`)}
      disabled={disabled}
    />
  );
}

function OwnerLabel({ value }: { value: string }) {
  return (
    <div className={styles.field}>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

type OwnerDropdownProps = {
  options: InformationPageOwnerOptionDto[];
  value?: Owner;
  placeholder?: string;
  disabled?: boolean;
  onChange: (owner: Owner | undefined) => void;
};

function OwnerDropdown({ options, value, placeholder, onChange, disabled }: OwnerDropdownProps) {
  const rows = buildTree(options, value);
  const selected = value ? encode(value) : null;

  return (
    <Dropdown
      className={styles.field}
      options={rows}
      value={rows.some((row) => row.value === selected) ? selected : null}
      nullOption={placeholder ? { label: placeholder } : false}
      disabled={disabled}
      onChange={(encodedOwner) => onChange(encodedOwner ? decode(encodedOwner) : undefined)}
    />
  );
}

function ownerOf(option: InformationPageOwnerOptionDto): Owner {
  return option.section ? { type: 'section', id: option.section.id } : { type: 'gang', id: option.gang.id };
}

function sameOwner(a: Owner | undefined, b: Owner | undefined): boolean {
  return Boolean(a && b && a.type === b.type && a.id === b.id);
}

function encode(owner: Owner): string {
  return `${owner.type}:${owner.id}`;
}

function decode(value: string): Owner {
  const [type, id] = value.split(':');
  return { type: type as Owner['type'], id: Number(id) };
}

const NBSP = '\u00a0';

type TreeRow = { label: string; value: string; disabled: boolean; group?: string };

/**
 * Renders the options as a tree: organization > gang > section
 *
 * Gangs the user may not create for stay in the list as disabled rows, so their sections still have
 * something to hang off.
 */
function buildTree(options: InformationPageOwnerOptionDto[], value: Owner | undefined): TreeRow[] {
  const rows: TreeRow[] = [];

  for (const { organization, gangs } of groupByOrganization(options)) {
    const group = organization?.name;

    for (const gang of gangs) {
      rows.push(row(gang.option, '', value, group));

      gang.sections.forEach((section, index) => {
        const last = index === gang.sections.length - 1;
        rows.push(row(section, `${last ? '\u2514' : '\u251c'}\u2500${NBSP}`, value, group));
      });
    }
  }

  return rows;
}

function row(
  option: InformationPageOwnerOptionDto,
  indent: string,
  value: Owner | undefined,
  group: string | undefined,
): TreeRow {
  const owner = ownerOf(option);
  const name = option.section ? formatSectionName(option.section) : dbT(option.gang, 'name') ?? '';

  return {
    label: `${indent}${name}`,
    value: encode(owner),
    group,
    // The current owner stays selectable even where the user may not create for it
    disabled: !option.can_create && !sameOwner(owner, value),
  };
}

type OrganizationGroup = {
  organization: InformationPageOwnerOptionDto['organization'];
  gangs: { option: InformationPageOwnerOptionDto; sections: InformationPageOwnerOptionDto[] }[];
};

function groupByOrganization(options: InformationPageOwnerOptionDto[]): OrganizationGroup[] {
  const groups: OrganizationGroup[] = [];

  for (const option of options) {
    if (option.section) {
      groups.at(-1)?.gangs.at(-1)?.sections.push(option);
      continue;
    }

    const open = groups.at(-1);
    if (!open || (open.organization?.id ?? null) !== (option.organization?.id ?? null)) {
      groups.push({ organization: option.organization, gangs: [] });
    }
    groups.at(-1)?.gangs.push({ option, sections: [] });
  }

  return groups;
}

function flatLabel(option: InformationPageOwnerOptionDto): string {
  if (option.section) {
    return formatSectionName(option.section, option.gang, option.organization);
  }
  return formatGangName(option.gang, option.organization);
}

function localLabel(gang?: GangDto | null, section?: GangSectionDto | null): string {
  if (section) {
    return formatSectionName(section, gang);
  }
  return gang ? formatGangName(gang) : '—';
}
