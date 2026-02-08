import { createBrowserRouter } from 'react-router-dom';

/* =========================
   LAYOUT IMPORTS
========================= */
import { PublicLayout } from '../layouts/public/PublicLayout';
import { AuthLayout as PublicAuthLayout } from '../layouts/public/AuthLayout';

import { AuthLayout } from '../layouts/auth/AuthLayout';
import { PatientLayout } from '../layouts/patient/PatientLayout';
import { DoctorLayout } from '../layouts/doctor/DoctorLayout';
import { HospitalAdminLayout } from '../layouts/hospital-admin/HospitalAdminLayout';
import { SuperAdminLayout } from '../layouts/super-admin/SuperAdminLayout';
import { BillingLayout } from '../layouts/billing/BillingLayout';
import { AILayout } from '../layouts/ai/AILayout';

import { ErrorLayout } from '../layouts/shared/ErrorLayout';

/* =========================
   TEMP PLACEHOLDER COMPONENT
   (Pages baad me replace honge)
========================= */
type PlaceholderProps = {
  title: string;
};

const Placeholder = ({ title }: PlaceholderProps) => {
  return <div className="page-placeholder">{title}</div>;
};

/* =========================
   APP ROUTER (SINGLE SOURCE)
========================= */
export const appRouter = createBrowserRouter([
  /* ---------- PUBLIC WEBSITE ---------- */
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Placeholder title="Home Page" /> },
      { path: 'search', element: <Placeholder title="Search Page" /> },
      { path: 'hospitals', element: <Placeholder title="Hospitals Listing" /> },
      { path: 'doctors', element: <Placeholder title="Doctors Listing" /> },
    ],
  },

  /* ---------- PUBLIC AUTH (MARKETING) ---------- */
  {
    path: '/auth',
    element: <PublicAuthLayout />,
    children: [
      { path: 'login', element: <Placeholder title="Login" /> },
      { path: 'register', element: <Placeholder title="Register" /> },
      { path: 'forgot-password', element: <Placeholder title="Forgot Password" /> },
      { path: 'reset-password', element: <Placeholder title="Reset Password" /> },
    ],
  },

  /* ---------- SYSTEM AUTH ---------- */
  {
    path: '/system-auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Placeholder title="System Login" /> },
    ],
  },

  /* ---------- PATIENT ---------- */
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      { index: true, element: <Placeholder title="Patient Dashboard" /> },
      { path: 'appointments', element: <Placeholder title="My Appointments" /> },
      { path: 'history', element: <Placeholder title="Medical History" /> },
      { path: 'profile', element: <Placeholder title="Patient Profile" /> },
    ],
  },

  /* ---------- DOCTOR ---------- */
  {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
      { index: true, element: <Placeholder title="Doctor Dashboard" /> },
      { path: 'appointments', element: <Placeholder title="Today Appointments" /> },
      { path: 'availability', element: <Placeholder title="Availability" /> },
      { path: 'prescriptions', element: <Placeholder title="Prescriptions" /> },
    ],
  },

  /* ---------- HOSPITAL ADMIN ---------- */
  {
    path: '/hospital-admin',
    element: <HospitalAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Hospital Admin Dashboard" /> },
      { path: 'doctors', element: <Placeholder title="Doctors Management" /> },
      { path: 'departments', element: <Placeholder title="Departments" /> },
      { path: 'billing', element: <Placeholder title="Billing Overview" /> },
    ],
  },

  /* ---------- SUPER ADMIN ---------- */
  {
    path: '/super-admin',
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <Placeholder title="Super Admin Dashboard" /> },
      { path: 'hospitals', element: <Placeholder title="Hospitals" /> },
      { path: 'approvals', element: <Placeholder title="Approvals" /> },
      { path: 'analytics', element: <Placeholder title="Analytics" /> },
      { path: 'system-health', element: <Placeholder title="System Health" /> },
    ],
  },

  /* ---------- BILLING ---------- */
  {
    path: '/billing',
    element: <BillingLayout />,
    children: [
      { index: true, element: <Placeholder title="Billing Overview" /> },
      { path: 'invoices', element: <Placeholder title="Invoices" /> },
      { path: 'plans', element: <Placeholder title="Plans" /> },
    ],
  },

  /* ---------- AI ---------- */
  {
    path: '/ai',
    element: <AILayout />,
    children: [
      { index: true, element: <Placeholder title="AI Assistant" /> },
      { path: 'history', element: <Placeholder title="AI History" /> },
      { path: 'insights', element: <Placeholder title="AI Insights" /> },
    ],
  },

  /* ---------- FALLBACK ---------- */
  {
    path: '*',
    element: <ErrorLayout />,
  },
]);
