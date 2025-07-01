import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DoctorCard from './DoctorCard';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Static doctors for fallback
const staticDoctors = [
  {
    id: 'static-1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0d8488&color=fff&size=300',
    rating: 4.9,
    experience: '15+ years',
    location: 'Main Campus',
    availability: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    bio: 'Dr. Johnson is a board-certified cardiologist with expertise in interventional cardiology and heart disease prevention.'
  },
  {
    id: 'static-2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=0d8488&color=fff&size=300',
    rating: 4.8,
    experience: '12+ years',
    location: 'North Wing',
    availability: ['10:00 AM', '1:00 PM', '3:30 PM'],
    bio: 'Specializing in neurological disorders and brain health, Dr. Chen brings cutting-edge treatment approaches.'
  },
  {
    id: 'static-3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0d8488&color=fff&size=300',
    rating: 5.0,
    experience: '10+ years',
    location: 'Children\'s Wing',
    availability: ['8:00 AM', '10:30 AM', '2:30 PM', '4:30 PM'],
    bio: 'Dr. Rodriguez is dedicated to providing comprehensive pediatric care with a gentle, family-centered approach.'
  },
  {
    id: 'static-4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    image: 'https://ui-avatars.com/api/?name=James+Wilson&background=0d8488&color=fff&size=300',
    rating: 4.7,
    experience: '18+ years',
    location: 'Sports Medicine',
    availability: ['9:30 AM', '1:30 PM', '3:00 PM'],
    bio: 'Expert in sports medicine and joint replacement surgery, helping patients regain mobility and strength.'
  }
];

const specialties = [
  'All Specialties',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology'
];

const DoctorsSection = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(staticDoctors);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState(staticDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Subscribe to admin-added doctors
    const doctorsQuery = query(
      collection(db, 'doctors'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(doctorsQuery, (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0d8488&color=fff&size=300`,
          rating: 4.5, // Default rating for admin-added doctors
          experience: data.experience,
          location: data.department,
          availability: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'], // Default availability
          bio: `${data.qualifications}. Specializing in ${data.specialty}.`
        };
      });
      setAdminDoctors(doctorsData);
      
      // Combine static doctors with admin-added doctors
      const allDoctors = [...staticDoctors, ...doctorsData];
      setDoctors(allDoctors);
    }, (error) => {
      console.error('Error fetching doctors:', error);
      // Keep static doctors if Firebase fails
      setDoctors(staticDoctors);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const handleBookAppointment = (doctorId: string) => {
    console.log('Booking appointment with doctor:', doctorId);
    navigate('/appointments');
  };

  const handleViewAllDoctors = () => {
    setShowAll(true);
    // Clear filters to show all doctors
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
  };

  const displayedDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 4);

  return (
    <section id="doctors" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            <span>Our Medical Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Meet Our Expert <span className="text-teal-600">Doctors</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our team of world-class physicians brings decades of experience and 
            cutting-edge expertise to provide you with the best possible care.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-teal-500"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-48 h-12 border-slate-200">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <DoctorCard
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
              />
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-500 text-lg">No doctors found matching your criteria.</p>
          </motion.div>
        )}

        {/* CTA */}
        {!showAll && filteredDoctors.length > 4 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
              onClick={handleViewAllDoctors}
            >
              View All Doctors
            </Button>
          </motion.div>
        )}

        {showAll && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              size="lg" 
              variant="outline"
              className="px-8"
              onClick={() => setShowAll(false)}
            >
              Show Less
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
