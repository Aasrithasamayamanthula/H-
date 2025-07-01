import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, UserCog, BarChart3, Bell, Settings, Check, Clock, MessageSquare, MessageSquareX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: any;
  payment?: string; // Add payment field
  paymentScreenshot?: string; // Add payment screenshot field
}

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  qualifications: string;
  experience: string;
  department: string;
  createdAt: any;
}

const appointmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Please select a department'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

const patientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Please select date of birth'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
});

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  qualifications: z.string().min(5, 'Qualifications must be at least 5 characters'),
  experience: z.string().min(1, 'Please enter years of experience'),
  department: z.string().min(1, 'Please select a department'),
});

const Admin = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<any[]>([]); // Add patients state
  const [loading, setLoading] = useState(true);
  const [isAppointmentSheetOpen, setIsAppointmentSheetOpen] = useState(false);
  const [isPatientSheetOpen, setIsPatientSheetOpen] = useState(false);
  const [isDoctorSheetOpen, setIsDoctorSheetOpen] = useState(false);
  const { toast } = useToast();

  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      date: '',
      time: '',
      reason: '',
    },
  });

  const patientForm = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
    },
  });

  const doctorForm = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      specialty: '',
      email: '',
      phone: '',
      qualifications: '',
      experience: '',
      department: '',
    },
  });

  useEffect(() => {
    // Subscribe to appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(appointmentsData);
      console.log('Appointments loaded:', appointmentsData.length);
    }, (error) => {
      console.error('Error fetching appointments:', error);
    });

    // Subscribe to messages
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
      console.log('Messages loaded:', messagesData.length);
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    // Subscribe to doctors
    const doctorsQuery = query(
      collection(db, 'doctors'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeDoctors = onSnapshot(doctorsQuery, (snapshot) => {
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(doctorsData);
      console.log('Doctors loaded:', doctorsData.length);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    });

    // Subscribe to patients
    const patientsQuery = query(
      collection(db, 'patients'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribePatients = onSnapshot(patientsQuery, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsData);
    }, (error) => {
      console.error('Error fetching patients:', error);
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeMessages();
      unsubscribeDoctors();
      unsubscribePatients();
    };
  }, []);

  const onAppointmentSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    try {
      await addDoc(collection(db, 'appointments'), {
        ...values,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
      
      appointmentForm.reset();
      setIsAppointmentSheetOpen(false);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  const onPatientSubmit = async (values: z.infer<typeof patientSchema>) => {
    try {
      await addDoc(collection(db, 'patients'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      
      patientForm.reset();
      setIsPatientSheetOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
    }
  };

  const onDoctorSubmit = async (values: z.infer<typeof doctorSchema>) => {
    try {
      await addDoc(collection(db, 'doctors'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Success",
        description: "Doctor added successfully",
      });
      
      doctorForm.reset();
      setIsDoctorSheetOpen(false);
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive",
      });
    }
  };

  const deleteDoctor = async (doctorId: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', doctorId));
      
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: `Appointment status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: `Message marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppContact = (phone: string, name: string, type: 'appointment' | 'message') => {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    let message = '';
    if (type === 'appointment') {
      message = `Dear ${name},

Greetings from [Hospital Name] Healthcare Services.

We hope this message finds you in good health. We are reaching out regarding your recent appointment request with our medical team.

Our staff would like to confirm the details and assist you with any questions you may have about your upcoming visit.

Please reply to this message or call our reception desk at your convenience.

Best regards,
Patient Care Team
[Hospital Name]`;
    } else {
      message = `Dear ${name},

Thank you for contacting [Hospital Name] Healthcare Services.

We have received your inquiry and greatly appreciate you reaching out to us. Our patient care team has reviewed your message and would like to provide you with a personalized response.

We are committed to addressing your concerns promptly and ensuring you receive the best possible care and service.

Please expect a detailed response from our team shortly, or feel free to reply if you have any urgent questions.

Warm regards,
Customer Service Team
[Hospital Name]`;
    }
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: Bell },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'doctors', label: 'Doctor Management', icon: UserCog },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const unreadMessages = messages.filter(msg => msg.status === 'unread');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Hospital Admin Dashboard</h1>
            <p className="text-slate-600 text-sm">Manage your hospital operations</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/">Back to Website</a>
          </Button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-r border-gray-200 min-h-[56px] sm:min-h-[calc(100vh-80px)]">
          <nav className="flex sm:block overflow-x-auto p-2 sm:p-4 space-x-2 sm:space-x-0 sm:space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:w-full flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors min-w-[120px] sm:min-w-0 max-w-xs sm:max-w-none text-xs sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-teal-100 text-teal-700 border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {tab.id === 'appointments' && pendingAppointments.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingAppointments.length}
                  </span>
                )}
                {tab.id === 'messages' && unreadMessages.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages.length}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">Appointment Management</h2>
                    <Sheet open={isAppointmentSheetOpen} onOpenChange={setIsAppointmentSheetOpen}>
                      <SheetTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-700">Schedule Appointment</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Schedule New Appointment</SheetTitle>
                          <SheetDescription>
                            Fill in the details to schedule a new appointment.
                          </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                          <Form {...appointmentForm}>
                            <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-4 mt-4">
                              <FormField
                                control={appointmentForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Patient Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter patient name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={appointmentForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={appointmentForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={appointmentForm.control}
                                name="department"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="cardiology">Cardiology</SelectItem>
                                        <SelectItem value="dermatology">Dermatology</SelectItem>
                                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                        <SelectItem value="neurology">Neurology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={appointmentForm.control}
                                  name="date"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={appointmentForm.control}
                                  name="time"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Time</FormLabel>
                                      <FormControl>
                                        <Input type="time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={appointmentForm.control}
                                name="reason"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Reason for Visit</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Enter reason for visit" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full">Schedule Appointment</Button>
                            </form>
                          </Form>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-teal-600">{todayAppointments.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-orange-600">{pendingAppointments.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Appointments</CardTitle>
                      <CardDescription>Latest appointment bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {appointments.slice(0, 10).map((appointment) => (
                          <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <h3 className="font-semibold">{appointment.name}</h3>
                              <p className="text-sm text-slate-600">{appointment.department} - {appointment.date} at {appointment.time}</p>
                              <p className="text-sm text-slate-500">{appointment.email} | {appointment.phone}</p>
                              <p className="text-xs text-slate-500 mt-1">Payment: <span className="font-semibold text-teal-700">{appointment.payment || 'N/A'}</span></p>
                              {appointment.paymentScreenshot && (
                                <a
                                  href={appointment.paymentScreenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-xs text-blue-600 underline hover:text-blue-800"
                                >
                                  View Payment Screenshot
                                </a>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant={appointment.status === 'pending' ? 'default' : 'outline'}
                                  onClick={() => updateAppointmentStatus(appointment.id, 'pending')}
                                  className={appointment.status === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}

                                >
                                  <Clock className="w-4 h-4 mr-1" />
                                  Pending
                                </Button>
                                <Button
                                  size="sm"
                                  variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  className={appointment.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : ''}

                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Confirmed
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWhatsAppContact(appointment.phone, appointment.name, 'appointment')}
                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                              >
                                WhatsApp
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteAppointment(appointment.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {appointments.length === 0 && (
                          <p className="text-slate-600 text-center py-8">No appointments found</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">Message Management</h2>
                    <div className="text-sm text-slate-600">
                      {unreadMessages.length} unread messages
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Messages</CardTitle>
                      <CardDescription>Latest contact form submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {messages.slice(0, 10).map((message) => (
                          <div key={message.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{message.firstName} {message.lastName}</h3>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">Subject: {message.subject}</p>
                              <p className="text-sm text-slate-500 mb-2">{message.email} | {message.phone}</p>
                              <p className="text-sm text-slate-700">{message.message}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant={message.status === 'unread' ? 'default' : 'outline'}
                                  onClick={() => updateMessageStatus(message.id, 'unread')}
                                  className={message.status === 'unread' ? 'bg-red-500 hover:bg-red-600' : ''}
                                >
                                  <MessageSquareX className="w-4 h-4 mr-1" />
                                  Unread
                                </Button>
                                <Button
                                  size="sm"
                                  variant={message.status === 'read' ? 'default' : 'outline'}
                                  onClick={() => updateMessageStatus(message.id, 'read')}
                                  className={message.status === 'read' ? 'bg-green-500 hover:bg-green-600' : ''}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Read
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWhatsAppContact(message.phone, `${message.firstName} ${message.lastName}`, 'message')}
                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                              >
                                WhatsApp
                              </Button>
                            </div>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <p className="text-slate-600 text-center py-8">No messages found</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-800">Reports & Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-teal-600">{todayAppointments.length}</p>
                        <p className="text-slate-600">Appointments today</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                        <p className="text-slate-600">Contact inquiries</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-orange-600">{pendingAppointments.length + unreadMessages.length}</p>
                        <p className="text-slate-600">Require attention</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">Patient Management</h2>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Patients List</CardTitle>
                      <CardDescription>All registered patients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                          <thead>
                            <tr>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Address</th>
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Emergency Contact</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {patients.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">No patients found.</td>
                              </tr>
                            ) : (
                              patients.map((patient) => (
                                <tr key={patient.id}>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{patient.firstName} {patient.lastName}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{patient.email}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{patient.phone}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{patient.dateOfBirth}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap hidden md:table-cell">{patient.address}</td>
                                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap hidden md:table-cell">{patient.emergencyContact}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'doctors' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">Doctor Management</h2>
                    <Sheet open={isDoctorSheetOpen} onOpenChange={setIsDoctorSheetOpen}>
                      <SheetTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-700">Add New Doctor</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Add New Doctor</SheetTitle>
                          <SheetDescription>
                            Fill in the doctor's information to add them to the system.
                          </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                          <Form {...doctorForm}>
                            <form onSubmit={doctorForm.handleSubmit(onDoctorSubmit)} className="space-y-4 mt-4">
                              <FormField
                                control={doctorForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Doctor Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter doctor name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="specialty"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Specialty</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter specialty" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="qualifications"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Qualifications</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Enter qualifications" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="experience"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Years of Experience</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter years of experience" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={doctorForm.control}
                                name="department"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="cardiology">Cardiology</SelectItem>
                                        <SelectItem value="dermatology">Dermatology</SelectItem>
                                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                        <SelectItem value="neurology">Neurology</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" className="w-full">Add Doctor</Button>
                            </form>
                          </Form>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Staff ({doctors.length} doctors)</CardTitle>
                      <CardDescription>Manage doctor profiles and schedules</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {doctors.map((doctor) => (
                          <div key={doctor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-slate-600">{doctor.specialty} - {doctor.department}</p>
                              <p className="text-sm text-slate-500">{doctor.email} | {doctor.phone}</p>
                              <p className="text-sm text-slate-500">{doctor.experience} experience</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteDoctor(doctor.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                        {doctors.length === 0 && (
                          <p className="text-slate-600 text-center py-8">No doctors added yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-800">System Settings</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Hospital Configuration</CardTitle>
                      <CardDescription>Manage hospital settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Settings interface will be implemented here.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
