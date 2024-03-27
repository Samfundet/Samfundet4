import { KEY, KeyValues } from '~/i18n/constants';
import { EventAgeRestriction, EventAgeRestrictionValue } from '~/types';

/**
 * Gets the translation key for a given age restriction
 */
export function getEventAgeRestrictionKey(ageRestriction: EventAgeRestrictionValue): KeyValues {
  switch (ageRestriction) {
    case EventAgeRestriction.NONE:
      return KEY.none;
    case EventAgeRestriction.EIGHTEEN:
      return KEY.eighteen;
    case EventAgeRestriction.TWENTY:
      return KEY.twenty;
    case EventAgeRestriction.MIXED:
      return KEY.mix;
  }
}
