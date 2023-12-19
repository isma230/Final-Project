/* eslint-disable perfectionist/sort-imports */
import "./back-office/global.css";

import { useScrollToTop } from "./back-office/hooks/use-scroll-to-top";
import Router from "./back-office/routes/sections";
import ThemeProvider from "./back-office/theme";
import Layout from "./front-store/components/Layout/Layout";
import { Routes, Route,Navigate} from "react-router-dom";

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/front-store/login" />} />
        <Route path="/front-store/*" element={<Layout />} />
        <Route
          path="/back-office/*"
          element={
            <ThemeProvider>
              <Router />
            </ThemeProvider>
          }
        />
      </Routes>
    </>
  );
}
