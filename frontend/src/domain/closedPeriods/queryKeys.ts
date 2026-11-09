export const closedPeriodKeys = {
  all: ['closed-periods'] as const,
  lists: () => [...closedPeriodKeys.all, 'list'] as const,
  list: () => [...closedPeriodKeys.lists(), {}] as const,
  detail: (id: string | number) => [...closedPeriodKeys.all, id] as const,
  active: () => [...closedPeriodKeys.all, 'active'] as const,
};
