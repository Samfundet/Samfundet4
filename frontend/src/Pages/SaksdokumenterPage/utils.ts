export function monthValueToString(month: number | undefined | ''): string {
  if (month) {
    const months = [
      'JAN',
      'Feb',
      'Mar',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'October',
      'November',
      'Desember',
    ];
    return months[month];
  }
  return 'month';
}
