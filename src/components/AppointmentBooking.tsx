import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const departments = [
  'Cardiology',
  'Neurology', 
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology',
  'Emergency Medicine'
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+86', label: 'China (+86)' },
  // Add more as needed
];

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    date: '',
    time: '',
    reason: '',
    payment: '',
    paymentScreenshot: '' // Add payment screenshot URL
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let paymentScreenshotUrl = '';
    try {
      if (formData.payment === 'Pay Now' && file) {
        setFileUploading(true);
        // Upload to Cloudinary
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        paymentScreenshotUrl = await uploadToCloudinary(file);
        setFileUploading(false);
      }
      // Save to Firestore
      const appointmentData = {
        ...formData,
        phone: countryCode + formData.phone,
        paymentScreenshot: paymentScreenshotUrl,
        status: 'pending',
        payment: formData.payment || 'Pay at Hospital',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      setIsSuccess(true);
      toast({
        title: "Appointment Booked Successfully!",
        description: "We'll send you a confirmation email shortly.",
      });
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          date: '',
          time: '',
          reason: '',
          payment: '',
          paymentScreenshot: ''
        });
        setFile(null);
      }, 3000);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Please try again or contact us directly.'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setFileUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="appointments" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Appointment Confirmed!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Your appointment has been successfully booked. We'll send you a confirmation email with all the details.
            </p>
            <div className="bg-slate-50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-slate-800 mb-3">Appointment Details:</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Patient:</strong> {formData.name}</p>
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Time:</strong> {formData.time}</p>
                <p><strong>Payment:</strong> {formData.payment || 'Pay at Hospital'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="appointments" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Schedule Your <span className="text-teal-600">Visit</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your preferred date and time. We'll confirm your appointment 
            and send you all the necessary details.
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-2xl text-center text-slate-800">
                Appointment Booking Form
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-teal-600" />
                      Full Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-teal-600" />
                      Phone Number *
                    </label>
                    <div className="flex">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="h-12 border border-gray-300 rounded-l-md px-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      >
                        {countryCodes.map(opt => (
                          <option key={opt.code} value={opt.code}>{opt.label}</option>
                        ))}
                      </select>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="h-12 rounded-l-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-teal-600" />
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12"
                  />
                </div>

                {/* Appointment Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Department *
                    </label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                      Preferred Date *
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-teal-600" />
                      Preferred Time *
                    </label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Reason for Visit
                  </label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Please describe your symptoms or reason for the visit (optional)"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Payment Option *
                  </label>
                  <select
                    required
                    value={formData.payment}
                    onChange={e => handleInputChange('payment', e.target.value)}
                    className="h-12 w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select payment option</option>
                    <option value="Pay Now">Pay Now (Online)</option>
                    <option value="Pay at Hospital">Pay at Hospital</option>
                  </select>
                  {/* QR code for Pay Now */}
                  {formData.payment === 'Pay Now' && (
                    <div className="mt-4 flex flex-col items-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=7981210978@ybl&pn=Patient%20Payment&am=&cu=INR"
                        alt="UPI QR Code"
                        className="w-40 h-40 border rounded-lg mb-2"
                      />
                      <div className="text-center text-sm text-slate-700">
                        <div className="font-semibold">Scan & Pay via UPI</div>
                        <div>UPI ID: <span className="font-mono">7981210978@ybl</span></div>
                        <div className="text-xs text-slate-500">(PhonePe, Google Pay, Paytm, etc.)</div>
                      </div>
                      <div className="mt-4 w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Payment Screenshot *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          required={formData.payment === 'Pay Now'}
                        />
                        {fileUploading && <div className="text-xs text-teal-600 mt-1">Uploading screenshot...</div>}
                        {file && <div className="text-xs text-slate-600 mt-1">Selected: {file.name}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Booking Appointment...</span>
                      </div>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentBooking;
