/* eslint-disable perfectionist/sort-imports */
import './back-office/global.css';

import { useScrollToTop } from './back-office/hooks/use-scroll-to-top';

import Router from './back-office/routes/sections';
import ThemeProvider from './back-office/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
