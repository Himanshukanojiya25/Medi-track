// client/src/routes/patient/patient.routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from '../../layouts/patient';

// DIRECT IMPORT - NO LAZY LOADING
import { ProfileScreen } from '../../features/patient/profile/ProfileScreen';

// Dashboard Screen
const PatientDashboardScreen = React.lazy(() => 
  import('../../features/patient/dashboard/PatientDashboardScreen').then(m => ({ default: m.PatientDashboardScreen }))
);

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Placeholders
const BookAppointmentScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Book Appointment</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const AppointmentsHistoryScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Appointment History</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const AppointmentDetailScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Appointment Details</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const RescheduleAppointmentScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Reschedule Appointment</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const DoctorsListScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Find Doctors</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const HospitalsListScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Find Hospitals</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const FavoritesScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">My Favorites</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const PrescriptionsScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">My Prescriptions</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const MedicalHistoryScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Medical History</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const NotificationsScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Notifications</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const UploadReportScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Upload Reports</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const FeedbackScreen: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Feedback</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

export const PatientRoutes: React.FC = () => {
  console.log('🔵🔵🔵 PatientRoutes RENDERING 🔵🔵🔵');
  
  return (
    <Routes>
      <Route path="/" element={<PatientLayout />}>
        {/* Dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={
          <React.Suspense fallback={<LoadingFallback />}>
            <PatientDashboardScreen />
          </React.Suspense>
        } />

        {/* PROFILE - DIRECT IMPORT */}
        <Route path="profile" element={<ProfileScreen />} />
        
        {/* Appointments */}
        <Route path="appointments">
          <Route index element={<AppointmentsHistoryScreen />} />
          <Route path="book" element={<BookAppointmentScreen />} />
          <Route path=":appointmentId" element={<AppointmentDetailScreen />} />
          <Route path=":appointmentId/reschedule" element={<RescheduleAppointmentScreen />} />
        </Route>

        <Route path="doctors">
          <Route index element={<DoctorsListScreen />} />
          <Route path=":doctorId" element={<DoctorsListScreen />} />
        </Route>

        <Route path="hospitals">
          <Route index element={<HospitalsListScreen />} />
          <Route path=":hospitalId" element={<HospitalsListScreen />} />
        </Route>

        <Route path="favorites" element={<FavoritesScreen />} />
        
        <Route path="prescriptions">
          <Route index element={<PrescriptionsScreen />} />
          <Route path=":prescriptionId" element={<PrescriptionsScreen />} />
        </Route>

        <Route path="medical-history">
          <Route index element={<MedicalHistoryScreen />} />
          <Route path=":recordId" element={<MedicalHistoryScreen />} />
        </Route>

        <Route path="notifications" element={<NotificationsScreen />} />
        <Route path="uploads" element={<UploadReportScreen />} />
        <Route path="feedback" element={<FeedbackScreen />} />

        <Route path="*" element={
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <button
              onClick={() => window.location.href = '/patient/dashboard'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        } />
      </Route>
    </Routes>
  );
};