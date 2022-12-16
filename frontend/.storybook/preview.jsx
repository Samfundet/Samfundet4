import '~/global.scss';

// Neccessary import for translations
import '~/i18n/i18n';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Wrap your stories in the I18nextProvider component
const WithI18next = (Story, context) => {
  const { locale } = context.globals;
  const { i18n } = useTranslation();

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return <Story />;
};

// export decorators for storybook to wrap your stories in
export const decorators = [WithI18next];

// Create a global variable called locale in storybook
// and add a menu in the toolbar to change your locale
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      dynamicTitle: true,
      items: [
        { value: 'en', title: 'English' },
        { value: 'nb', title: 'Norwegian' },
      ],
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
