import { motion } from 'framer-motion';
import { Calendar, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  location: string;
  availability: string[];
  bio: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctorId: string) => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Doctor Image */}
      <div className="relative h-64 bg-gradient-to-br from-teal-100 to-blue-100">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0d8488&color=fff&size=300`;
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-slate-700">{doctor.rating}</span>
          </div>
        </div>

        {/* Availability Indicator */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available Today
          </Badge>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{doctor.name}</h3>
          <p className="text-teal-600 font-semibold">{doctor.specialty}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{doctor.location}</span>
            </span>
            <span>{doctor.experience}</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {doctor.bio}
        </p>

        {/* Availability Slots */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Available Times:</p>
          <div className="flex flex-wrap gap-2">
            {doctor.availability.slice(0, 3).map((time, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
            {doctor.availability.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{doctor.availability.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => onBookAppointment(doctor.id)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
          <Link to={`/doctor/${doctor.id}`}>
            <Button variant="outline" className="px-4">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
