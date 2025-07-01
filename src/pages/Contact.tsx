
import Navigation from '@/components/Navigation';
import Contact from '@/components/Contact';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;
