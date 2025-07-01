
import Navigation from '@/components/Navigation';
import DoctorsSection from '@/components/DoctorsSection';

const Doctors = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <DoctorsSection />
      </div>
    </div>
  );
};

export default Doctors;
