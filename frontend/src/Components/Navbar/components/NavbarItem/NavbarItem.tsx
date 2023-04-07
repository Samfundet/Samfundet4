import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '~/GlobalContextProvider';
import { useDesktop } from '~/hooks';
import { Children, SetState } from '~/types';
import styles from '../../Navbar.module.scss';

type NavbarItemProps = {
  route: string;
  label: string;
  dropdownLinks?: Children;
  expandedDropdown?: string;
  setExpandedDropdown: SetState<string>;
};

const iconUp = 'carbon:chevron-up';
const iconDown = 'carbon:chevron-down';

export function NavbarItem({ label, route, expandedDropdown, setExpandedDropdown, dropdownLinks }: NavbarItemProps) {
  const { setIsMobileNavigation } = useGlobalContext();
  const isDesktop = useDesktop();
  const isSelected = expandedDropdown === label;
  const otherIsSelected = !isSelected && expandedDropdown !== '';

  const itemClasses = classNames(
    isDesktop ? styles.navbar_item : styles.navbar_mobile_item,
    dropdownLinks && styles.navbar_dropdown_item,
    otherIsSelected && styles.hidden,
  );

  const dropdownClasses = classNames(
    isDesktop ? styles.dropdown_container : styles.mobile_dropdown_container,
    isSelected && styles.dropdown_open,
  );

  // Desktop: show dropdown on hover
  // Mobile: show dropdown after clicking
  const showDropdown = dropdownLinks && (isDesktop || isSelected);

  function handleClick() {
    if (!dropdownLinks) {
      // Given no dropdownLinks, the user is about to follow a link -> close the mobileNavigation.
      setIsMobileNavigation(false);
    } else if (!isDesktop) {
      // toggle dropdown
      setExpandedDropdown(isSelected ? '' : label);
    }
  }

  const icon = isSelected ? iconUp : iconDown;

  return (
    <div className={itemClasses}>
      <Link to={route} className={isDesktop ? styles.navbar_link : styles.popup_link_mobile} onClick={handleClick}>
        {label}
        {dropdownLinks && <Icon icon={icon} width={18} />}
      </Link>
      {showDropdown && <div className={dropdownClasses}>{dropdownLinks}</div>}
    </div>
  );
}
