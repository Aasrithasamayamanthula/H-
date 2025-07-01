
import Navigation from '@/components/Navigation';
import HealthRecords from '@/components/HealthRecords';

const HealthRecordsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <HealthRecords />
      </div>
    </div>
  );
};

export default HealthRecordsPage;
