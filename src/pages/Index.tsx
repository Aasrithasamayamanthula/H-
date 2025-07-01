
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Phone, Heart, Shield, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-slate-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Your Health, Our
              <span className="text-teal-600 block">Priority</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience world-class healthcare with our comprehensive medical services. 
              From routine check-ups to specialized treatments, we're here for you every step of the way.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/appointments">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 text-lg">
                  Meet Our Doctors
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Why Choose HealthCare Plus?
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive healthcare services designed around your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-6 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Expert Care</h3>
              <p className="text-slate-600">
                Our team of experienced doctors and specialists provide personalized care for every patient.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">24/7 Service</h3>
              <p className="text-slate-600">
                Round-the-clock medical support and emergency services for your peace of mind.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Advanced Technology</h3>
              <p className="text-slate-600">
                State-of-the-art medical equipment and digital health records for better outcomes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Quick Access
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need, just a click away
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/appointments" className="group">
              <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                <Calendar className="w-12 h-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Book Appointment</h3>
                <p className="text-slate-600 text-sm">Schedule your visit with our specialists</p>
              </div>
            </Link>
            
            <Link to="/doctors" className="group">
              <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Our Doctors</h3>
                <p className="text-slate-600 text-sm">Meet our team of medical professionals</p>
              </div>
            </Link>
            
            <Link to="/health-records" className="group">
              <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                <FileText className="w-12 h-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Health Records</h3>
                <p className="text-slate-600 text-sm">Access your medical history and reports</p>
              </div>
            </Link>
            
            <Link to="/contact" className="group">
              <div className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow">
                <Phone className="w-12 h-12 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Contact Us</h3>
                <p className="text-slate-600 text-sm">Get in touch with our support team</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
