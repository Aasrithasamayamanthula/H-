
import { motion } from 'framer-motion';
import { FileText, Download, Upload, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';

interface HealthRecord {
  id: number;
  name: string;
  date: string;
  type: string;
  file?: File;
  url?: string;
}

const HealthRecords = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<HealthRecord[]>([
    { id: 1, name: 'Blood Test Results', date: '2024-01-15', type: 'Lab Report', url: '#' },
    { id: 2, name: 'X-Ray Chest', date: '2024-01-10', type: 'Imaging', url: '#' },
    { id: 3, name: 'Prescription History', date: '2024-01-05', type: 'Medication', url: '#' },
  ]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, JPEG, or PNG files only.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Create new record
      const newRecord: HealthRecord = {
        id: Date.now(),
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        type: file.type.includes('pdf') ? 'Document' : 'Image',
        file: file,
        url: URL.createObjectURL(file)
      };

      setRecords(prev => [newRecord, ...prev]);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been added to your records.`,
      });
    }
  };

  const handleDownload = (record: HealthRecord) => {
    if (record.file && record.url) {
      // For uploaded files, download the actual file
      const link = document.createElement('a');
      link.href = record.url;
      link.download = record.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${record.name} is being downloaded.`,
      });
    } else {
      // For sample records, show a message
      toast({
        title: "Sample record",
        description: "This is a sample record. In a real application, this would download the actual file.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (recordId: number) => {
    setRecords(prev => prev.filter(record => record.id !== recordId));
    toast({
      title: "Record deleted",
      description: "The health record has been removed.",
    });
  };

  return (
    <section id="records" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Health Records</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Access and manage your medical records securely
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-teal-600" />
                  <span>Upload Records</span>
                </CardTitle>
                <CardDescription>
                  Upload your medical documents for secure storage (PDF, JPEG, PNG - Max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your files here, or click to browse
                  </p>
                  <Button onClick={handleUpload} className="bg-teal-600 hover:bg-teal-700">
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Supported formats: PDF, JPEG, PNG (Max 5MB)</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Records List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>Your Records ({records.length})</span>
                </CardTitle>
                <CardDescription>
                  View and download your medical records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {records.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No records uploaded yet</p>
                    </div>
                  ) : (
                    records.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">{record.name}</h4>
                            <p className="text-sm text-slate-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {record.date} • {record.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(record)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          {record.file && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HealthRecords;
