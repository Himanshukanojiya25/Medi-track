// client/src/routes/patient/patient.routes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from '../../layouts/patient';

// Lazy load patient feature components
const PatientDashboardScreen = React.lazy(() => 
  import('../../features/patient/dashboard/PatientDashboardScreen').then(m => ({ default: m.PatientDashboardScreen }))
);
const BookAppointmentScreen = React.lazy(() => 
  import('../../features/patient/appointments/book/BookAppointmentScreen').then(m => ({ default: m.BookAppointmentScreen }))
);
const AppointmentsHistoryScreen = React.lazy(() => 
  import('../../features/patient/appointments/history/AppointmentsHistoryScreen').then(m => ({ default: m.AppointmentsHistoryScreen }))
);
const AppointmentDetailScreen = React.lazy(() => 
  import('../../features/patient/appointments/AppointmentDetailScreen').then(m => ({ default: m.AppointmentDetailScreen }))
);
const RescheduleAppointmentScreen = React.lazy(() => 
  import('../../features/patient/appointments/reschedule/RescheduleAppointmentScreen').then(m => ({ default: m.RescheduleAppointmentScreen }))
);
const DoctorsListScreen = React.lazy(() => 
  import('../../features/patient/doctors/DoctorsListScreen').then(m => ({ default: m.DoctorsListScreen }))
);
const HospitalsListScreen = React.lazy(() => 
  import('../../features/patient/hospitals/HospitalsListScreen').then(m => ({ default: m.HospitalsListScreen }))
);
const FavoritesScreen = React.lazy(() => 
  import('../../features/patient/favorites/FavoritesScreen').then(m => ({ default: m.FavoritesScreen }))
);
const PrescriptionsScreen = React.lazy(() => 
  import('../../features/patient/prescriptions/PrescriptionsScreen').then(m => ({ default: m.PrescriptionsScreen }))
);
const MedicalHistoryScreen = React.lazy(() => 
  import('../../features/patient/medical-history/MedicalHistoryScreen').then(m => ({ default: m.MedicalHistoryScreen }))
);
const ProfileScreen = React.lazy(() => 
  import('../../features/patient/profile/ProfileScreen').then(m => ({ default: m.ProfileScreen }))
);
const NotificationsScreen = React.lazy(() => 
  import('../../features/patient/notifications/NotificationsScreen').then(m => ({ default: m.NotificationsScreen }))
);
const UploadReportScreen = React.lazy(() => 
  import('../../features/patient/uploads/UploadReportScreen').then(m => ({ default: m.UploadReportScreen }))
);
const FeedbackScreen = React.lazy(() => 
  import('../../features/patient/feedback/FeedbackScreen').then(m => ({ default: m.FeedbackScreen }))
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

export const PatientRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<PatientLayout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboardScreen />} />

          {/* Appointments */}
          <Route path="appointments">
            <Route index element={<AppointmentsHistoryScreen />} />
            <Route path="book" element={<BookAppointmentScreen />} />
            <Route path=":appointmentId" element={<AppointmentDetailScreen />} />
            <Route path=":appointmentId/reschedule" element={<RescheduleAppointmentScreen />} />
          </Route>

          {/* Doctors */}
          <Route path="doctors">
            <Route index element={<DoctorsListScreen />} />
            <Route path=":doctorId" element={<div>Doctor Details - Coming Soon</div>} />
          </Route>

          {/* Hospitals */}
          <Route path="hospitals">
            <Route index element={<HospitalsListScreen />} />
            <Route path=":hospitalId" element={<div>Hospital Details - Coming Soon</div>} />
          </Route>

          {/* Favorites */}
          <Route path="favorites" element={<FavoritesScreen />} />

          {/* Prescriptions */}
          <Route path="prescriptions">
            <Route index element={<PrescriptionsScreen />} />
            <Route path=":prescriptionId" element={<div>Prescription Details - Coming Soon</div>} />
          </Route>

          {/* Medical History */}
          <Route path="medical-history">
            <Route index element={<MedicalHistoryScreen />} />
            <Route path=":recordId" element={<div>Medical Record Details - Coming Soon</div>} />
          </Route>

          {/* Profile & Settings */}
          <Route path="profile" element={<ProfileScreen />} />
          
          {/* Notifications */}
          <Route path="notifications" element={<NotificationsScreen />} />
          
          {/* Uploads */}
          <Route path="uploads" element={<UploadReportScreen />} />
          
          {/* Feedback */}
          <Route path="feedback" element={<FeedbackScreen />} />

          {/* 404 - Patient Not Found */}
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
    </React.Suspense>
  );
};