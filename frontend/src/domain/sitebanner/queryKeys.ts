export const siteBannerKeys = {
  all: ['siteBanners'] as const,
  active: () => [...siteBannerKeys.all, 'active'] as const,
};
