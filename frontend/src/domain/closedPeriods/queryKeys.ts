export const closedPeriodKeys = {
  all: ['closed-periods'] as const,
  detail: (id: number) => [closedPeriodKeys.all, id] as const,
};
