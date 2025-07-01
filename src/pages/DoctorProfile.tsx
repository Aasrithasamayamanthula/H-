
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Star, MapPin, Clock, Phone, Mail, Award, GraduationCap } from 'lucide-react';

// Mock doctor data - in real app this would come from API
const mockDoctor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0d8488&color=fff&size=400',
  rating: 4.9,
  experience: '15+ years',
  location: 'Main Campus - Cardiology Wing',
  phone: '+1 (555) 123-4567',
  email: 'sarah.johnson@healthcare.com',
  availability: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
  bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology and heart disease prevention. She specializes in advanced cardiac procedures and has helped thousands of patients achieve better heart health.',
  education: [
    'MD - Harvard Medical School',
    'Residency - Johns Hopkins Hospital',
    'Fellowship - Mayo Clinic'
  ],
  certifications: [
    'Board Certified Cardiologist',
    'Fellow of American College of Cardiology',
    'Advanced Cardiac Life Support'
  ],
  languages: ['English', 'Spanish', 'French'],
  reviews: [
    {
      patient: 'John D.',
      rating: 5,
      comment: 'Dr. Johnson is exceptional. She took the time to explain everything and made me feel comfortable.'
    },
    {
      patient: 'Maria S.',
      rating: 5,
      comment: 'Outstanding care and expertise. Highly recommend Dr. Johnson to anyone needing cardiac care.'
    }
  ]
};

const DoctorProfile = () => {
  const { id } = useParams();
  const doctor = mockDoctor; // In real app, fetch based on id

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Doctor Header */}
          <motion.div
            className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{doctor.name}</h1>
                <p className="text-xl text-teal-600 font-semibold mb-4">{doctor.specialty}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{doctor.rating}</span>
                    <span className="text-slate-600">(50+ reviews)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available Today</Badge>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.experience}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link to="/appointments">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About Dr. {doctor.name.split(' ')[1]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Education & Certifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5" />
                      <span>Education & Certifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Education</h4>
                        <ul className="space-y-2">
                          {doctor.education.map((edu, index) => (
                            <li key={index} className="text-slate-600">{edu}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Patient Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Reviews</CardTitle>
                    <CardDescription>What patients are saying</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {doctor.reviews.map((review, index) => (
                        <div key={index} className="border-l-4 border-teal-100 pl-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="font-medium text-slate-800">{review.patient}</span>
                          </div>
                          <p className="text-slate-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{doctor.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">{doctor.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Available Times */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Available Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availability.map((time, index) => (
                        <Button key={index} variant="outline" size="sm" className="text-xs">
                          {time}
                        </Button>
                      ))}
                    </div>
                    <Link to="/appointments" className="block mt-4">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Book Appointment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((language, index) => (
                        <Badge key={index} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
