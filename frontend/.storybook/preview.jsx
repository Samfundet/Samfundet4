import '~/global.scss';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { THEME } from '~/constants';
import { updateBodyThemeClass } from '~/utils';

import '~/i18n/i18n'; // Neccessary import for translations.

const WithI18next = (Story, context) => {
  const { locale } = context.globals;
  const { i18n } = useTranslation();

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return <Story />;
};

/**
 * https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
 */
const WithTheme = (Story, context) => {
  const theme = context.globals?.backgrounds?.value || 'side-by-side';

  useEffect(() => {
    updateBodyThemeClass(theme);
  }, [theme]);

  const isSideBySide = theme === 'side-by-side';

  if (isSideBySide) {
    return (
      <body style={{ display: 'flex', justifyContent: 'center' }}>
        <div data-theme={THEME.LIGHT} style={{ width: '100%', overflowX: 'scroll', padding: '5px' }}>
          <Story key={THEME.LIGHT} />
        </div>
        <div data-theme={THEME.DARK} style={{ width: '100%', overflowX: 'scroll', padding: '5px' }}>
          <Story key={THEME.DARK} />
        </div>
      </body>
    );
  }

  return <Story />;
};

function WithContext(Story) {
  return (
    <AuthContextProvider enabled={false}>
      <GlobalContextProvider enabled={false}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </GlobalContextProvider>
    </AuthContextProvider>
  );
}

// Export decorators for storybook to wrap your stories in.
export const decorators = [WithContext, WithI18next, WithTheme];

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

  backgrounds: {
    values: [
      {
        name: 'light',
        value: THEME.LIGHT,
      },
      {
        name: 'dark',
        value: THEME.DARK,
      },
      {
        name: 'Split view',
        value: 'side-by-side',
      },
    ],
  },
};
