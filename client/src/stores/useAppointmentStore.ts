import { create } from 'zustand';

interface AppointmentStore {
  appointments: any[];
  isLoading: boolean;
  setAppointments: (appointments: any[]) => void;
  addAppointment: (appointment: any) => void;
  clearAppointments: () => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  isLoading: false,
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) => set((state) => ({ 
    appointments: [...state.appointments, appointment] 
  })),
  clearAppointments: () => set({ appointments: [] }),
}));