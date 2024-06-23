import { Icon } from '@iconify/react';
import { Command } from 'cmdk';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CustomNavigateProps, useCustomNavigate, useIsMetaKeyDown, useTheme } from '~/hooks';
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
  const { switchTheme } = useTheme();

  const hasAdminPerms = true;

  const adminPanelUrl = ROUTES.backend.admin__index;
  const eventsUrl = ROUTES.frontend.events;

  function cmdNavigate(props: CustomNavigateProps) {
    navigate({ ...props, isMetaDown: isDown });
    setOpen(false);
  }

  // Toggle the menu when ⌘K is pressed.
  useEffect(() => {
    function down(e: KeyboardEvent) {
      const isCmdKClick = e.key === openKey && (e.metaKey || e.ctrlKey);
      if (isCmdKClick) {
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
            <Command.Item
              value="lyche-restaurant"
              onSelect={() => cmdNavigate({ url: ROUTES.frontend.lyche, linkTarget: 'frontend' })}
            >
              <Icon width={24} icon="ph:hamburger-fill" />
              {t(KEY.command_menu_shortcut_lyche)}
              <Shortcut keys={['g', 'l']} />
            </Command.Item>
            <Command.Item onSelect={() => cmdNavigate({ url: eventsUrl, linkTarget: 'frontend' })}>
              <Icon width={24} icon="tabler:building-circus" />
              {t(KEY.command_menu_shortcut_events)}
              <Shortcut keys={['g', 'e']} />
            </Command.Item>
            <Command.Item onSelect={() => cmdNavigate({ url: ROUTES.frontend.recruitment, linkTarget: 'frontend' })}>
              <Icon width={24} icon="fluent:organization-48-filled" />
              {t(KEY.command_menu_shortcut_recruitment)}
              <Shortcut keys={['g', 'r']} />
            </Command.Item>
            <Command.Item onSelect={() => cmdNavigate({ url: ROUTES.frontend.home, linkTarget: 'frontend' })}>
              <Icon width={24} icon="material-symbols:home" />
              {t(KEY.command_menu_shortcut_home)}
              <Shortcut keys={['g', 'h']} />
            </Command.Item>
            <Command.Item
              onSelect={() =>
                cmdNavigate({
                  url: ROUTES.frontend.admin_events_create,
                  linkTarget: 'frontend',
                })
              }
            >
              <Icon width={24} icon="mdi:plus" />
              {t(KEY.command_menu_shortcut_create_event)}
            </Command.Item>
            <Command.Item
              onSelect={() =>
                cmdNavigate({
                  url: ROUTES.frontend.venues,
                  linkTarget: 'frontend',
                })
              }
            >
              <Icon width={24} icon="mdi:map" />
              {t(KEY.command_menu_shortcut_venues)}
            </Command.Item>
            {hasAdminPerms && (
              <Command.Item onSelect={() => cmdNavigate({ url: ROUTES.frontend.admin, linkTarget: 'frontend' })}>
                <Icon width={24} icon="material-symbols:settings" />
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
            {hasAdminPerms && (
              <Command.Item onSelect={() => cmdNavigate({ url: ROUTES.frontend.admin_closed, linkTarget: 'frontend' })}>
                <Icon width={24} icon="mdi:clock-time-eight-outline" />
                {t(KEY.command_menu_shortcut_opening_hours)}
              </Command.Item>
            )}
            {hasAdminPerms && (
              <Command.Item onSelect={() => cmdNavigate({ url: ROUTES.frontend.admin_closed, linkTarget: 'frontend' })}>
                <Icon width={24} icon="solar:moon-sleep-bold" />
                {t(KEY.command_menu_shortcut_closed)}
              </Command.Item>
            )}
          </Command.Group>

          {/* Group: Actions */}
          <Command.Group heading={t(KEY.command_menu_group_actions)}>
            <Command.Item
              onSelect={() => {
                switchTheme();
                setOpen(false);
              }}
            >
              <Icon width={24} icon="mdi:theme-light-dark" />
              {t(KEY.command_menu_action_change_theme)}
              <Shortcut keys={['g', 'a']} />
            </Command.Item>
          </Command.Group>

          {/* End: Command.List */}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
