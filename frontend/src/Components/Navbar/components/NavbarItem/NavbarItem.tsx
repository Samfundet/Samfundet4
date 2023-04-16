import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '~/GlobalContextProvider';
import { useClickOutside, useDesktop } from '~/hooks';
import { Children, SetState } from '~/types';
import styles from '../../Navbar.module.scss';

type NavbarItemProps = {
  route: string;
  label: string;
  dropdownLinks?: Children;
  expandedDropdown?: string;
  setExpandedDropdown: SetState<string>;
};

const iconDown = 'carbon:chevron-down';

export function NavbarItem({ label, route, expandedDropdown, setExpandedDropdown, dropdownLinks }: NavbarItemProps) {
  const { setIsMobileNavigation } = useGlobalContext();
  const isDesktop = useDesktop();
  const isSelected = expandedDropdown === label;
  const otherIsSelected = !isSelected && expandedDropdown !== '';

  // Close when click outside. Need to store this state
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    if (isSelected) {
      setExpandedDropdown('');
    }
  });

  const itemClasses = classNames(
    isDesktop ? styles.navbar_item : styles.navbar_mobile_item,
    dropdownLinks && styles.navbar_dropdown_item,
    otherIsSelected && !isDesktop && styles.hidden,
    isSelected && styles.selected,
  );

  const dropdownClasses = classNames({
    [styles.dropdown_container]: isDesktop,
    [styles.mobile_dropdown_container]: !isDesktop,
    [styles.dropdown_open]: isSelected,
  });

  // Toggle dropdown on click
  function handleClick() {
    if (!dropdownLinks) {
      // Given no dropdownLinks, the user is about to follow a link -> close the mobileNavigation.
      setIsMobileNavigation(false);
    } else {
      // toggle dropdown
      setExpandedDropdown(isSelected ? '' : label);
    }
  }

  return (
    <div className={itemClasses} ref={clickOutsideRef}>
      <Link to={route} className={isDesktop ? styles.navbar_link : styles.popup_link_mobile} onClick={handleClick}>
        {label}
        {dropdownLinks && (
          <Icon
            icon={iconDown}
            width={18}
            className={classNames({
              [styles.chevron]: true,
              [styles.flip]: isSelected,
            })}
          />
        )}
      </Link>
      {(isDesktop || isSelected) && <div className={dropdownClasses}>{dropdownLinks}</div>}
    </div>
  );
}
