import { Route } from "react-router-dom";
import {
  HomePage,
  AboutPage,
  ContactPage,
  DoctorsPage,
  HospitalsPage,
} from "../../pages";
import { WebsiteLayout } from "../../layouts/website";

export const WebsiteRoutes = () => {
  return (
    <Route element={<WebsiteLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
    </Route>
  );
};
