import { Icon } from '@iconify/react';
import { Command } from 'cmdk';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomNavigateProps, useCustomNavigate, useIsMetaKeyDown } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import './CommandMenu.scss';
import { Shortcut } from './components';

export type CommandMenuProps = {
  openKey?: string;
};

export function CommandMenu({ openKey = 'k' }: CommandMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const container = useRef(null);
  const navigate = useCustomNavigate();
  const isDown = useIsMetaKeyDown();

  const hasAdminPerms = true;

  const adminPanelUrl = ROUTES.backend.admin__index;
  const eventsUrl = ROUTES.frontend.events;
  const lycheUrl = ROUTES.frontend.lyche;
  const recruitmentUrl = ROUTES.frontend.recruitment;
  const controlPanelUrl = ROUTES.frontend.admin;
  const homeUrl = ROUTES.frontend.home;

  function cmdNavigate(props: CustomNavigateProps) {
    navigate({ ...props, isMetaDown: isDown });
    setOpen(false);
  }

  // Toggle the menu when ⌘K is pressed.
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === openKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        setSearch('');
      }
    }

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [openKey]);

  return (
    <>
      <div className={'command-menu'} ref={container}></div>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={t(KEY.command_menu_label) || undefined}
        container={container.current || undefined}
      >
        <Command.Input
          placeholder={t(KEY.command_menu_input_placeholder) || ''}
          value={search}
          onValueChange={setSearch}
        />
        <Command.List>
          {/* Empty */}
          <Command.Empty>{t(KEY.command_menu_no_results)}</Command.Empty>

          {/* Group: Shortcuts */}
          <Command.Group heading={t(KEY.command_menu_group_shortcuts)}>
            <Command.Item onSelect={() => cmdNavigate({ url: lycheUrl, linkTarget: 'frontend' })}>
              <Icon width={24} icon="material-symbols:settings" />
              {t(KEY.command_menu_shortcut_lyche)}
              <Shortcut keys={['g', 'l']} />
            </Command.Item>

            <Command.Item onSelect={() => cmdNavigate({ url: eventsUrl, linkTarget: 'frontend' })}>
              <Icon width={24} icon="tabler:arrows-transfer-down" />
              {t(KEY.command_menu_shortcut_events)}
              <Shortcut keys={['g', 'e']} />
            </Command.Item>

            <Command.Item onSelect={() => cmdNavigate({ url: recruitmentUrl, linkTarget: 'frontend' })}>
              <Icon width={24} icon="fluent:organization-48-filled" />
              {t(KEY.command_menu_shortcut_recruitment)}
              <Shortcut keys={['g', 'r']} />
            </Command.Item>

            <Command.Item onSelect={() => cmdNavigate({ url: homeUrl, linkTarget: 'frontend' })}>
              <Icon width={24} icon="material-symbols:home" />
              {t(KEY.command_menu_shortcut_home)}
              <Shortcut keys={['g', 'r']} />
            </Command.Item>

            {hasAdminPerms && (
              <Command.Item onSelect={() => cmdNavigate({ url: controlPanelUrl, linkTarget: 'frontend' })}>
                <Icon width={24} icon="mdi:shield" />
                {t(KEY.command_menu_shortcut_control_panel)}
                <Shortcut keys={['g', 'c']} />
              </Command.Item>
            )}

            {hasAdminPerms && (
              <Command.Item onSelect={() => cmdNavigate({ url: adminPanelUrl, linkTarget: 'backend' })}>
                <Icon width={24} icon="mdi:shield" />
                {t(KEY.command_menu_shortcut_admin)}
                <Shortcut keys={['g', 'a']} />
              </Command.Item>
            )}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
