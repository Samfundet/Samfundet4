export const closedPeriodKeys = {
  all: ['closed-periods'] as const,
  detail: (id: number) => [...closedPeriodKeys.all, 'detail', id] as const,
  active: () => [...closedPeriodKeys.all, 'active'] as const,
};
