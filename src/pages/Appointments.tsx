
import Navigation from '@/components/Navigation';
import AppointmentBooking from '@/components/AppointmentBooking';

const Appointments = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <AppointmentBooking />
      </div>
    </div>
  );
};

export default Appointments;
