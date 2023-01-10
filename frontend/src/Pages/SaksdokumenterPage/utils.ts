import { LANGUAGES } from '~/i18n/constants';

export function monthValueToString(month: number | undefined | '', language: string): string {
  if (month) {
    const months_nb = [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const months_en = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return language === LANGUAGES.EN ? months_en[month] : months_nb[month];
  }
  return 'month';
}
