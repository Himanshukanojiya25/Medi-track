// client/src/features/patient/appointments/index.ts
export { default as AppointmentDetailScreen } from './AppointmentDetailScreen';
export { default as CancelAppointmentModal } from './CancelAppointmentModal';

// Sub-feature exports (book, history, reschedule)
export * from './book';
export * from './history';
export * from './reschedule';