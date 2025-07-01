
import { motion } from 'framer-motion';
import { Calendar, Shield, Heart, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const features = [
    { icon: Calendar, text: '24/7 Emergency Care' },
    { icon: Shield, text: 'Expert Medical Team' },
    { icon: Heart, text: 'Compassionate Care' },
    { icon: Award, text: 'Award-Winning Service' },
  ];

  const handleBookAppointment = () => {
    const element = document.getElementById('appointments');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmergencyServices = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-100 via-blue-50 to-slate-100"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                ✨ Trusted Healthcare Since 1985
              </motion.div>
              
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Your Health is Our
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> Priority</span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-slate-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Experience world-class medical care with our team of expert physicians, 
                state-of-the-art facilities, and compassionate approach to healing.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-300 hover:border-teal-600 text-slate-700 hover:text-teal-600 px-8 py-3 text-lg font-semibold transition-all duration-300"
                onClick={handleEmergencyServices}
              >
                Emergency Services
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-2 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Placeholder for hero image - you can replace with actual medical imagery */}
              <div className="w-full h-full bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Modern Healthcare</h3>
                  <p className="text-white/80">Advanced Medical Technology</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">99% Success Rate</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">50+ Specialists</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
