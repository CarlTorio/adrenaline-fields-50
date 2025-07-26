import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookingData } from './BookingModal';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  service: z.string().min(1, 'Please select a service'),
  groupSize: z.number().min(1, 'Group size must be at least 1').max(50, 'Maximum group size is 50'),
  specialRequests: z.string().optional(),
  emergencyContact: z.string().optional(),
  experience: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface PatientFormProps {
  onSubmit: (data: Partial<BookingData>) => void;
  onBack: () => void;
  initialData?: Partial<BookingData>;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onBack, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      service: initialData?.service || '',
      groupSize: initialData?.groupSize || 1,
      specialRequests: initialData?.specialRequests || '',
      emergencyContact: initialData?.emergencyContact || '',
      experience: initialData?.experience || '',
    },
  });

  const services = [
    'Paintball Regular (P 700 + 30 bullets)',
    'Target Range Regular (P 250 + 10 bullets)',
    'Half Day Morning (8AM-12NN) - P 18,000',
    'Half Day Afternoon (1PM-5PM) - P 20,000',
    'Group Package - 10 Players (9+1 FREE)',
    'Group Package - 15 Players (14+1 FREE)',
    'Group Package - 20 Players (19+1 FREE)',
  ];

  const experienceLevels = [
    'First Time Player',
    'Beginner (1-3 times)',
    'Intermediate (4-10 times)',
    'Experienced (10+ times)',
    'Expert/Competitive Player',
  ];

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    {...register('emergencyContact')}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Paintball Session Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Service Package *</Label>
                  <Select onValueChange={(value) => setValue('service', value)} defaultValue={watch('service')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service package" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-sm text-destructive mt-1">{errors.service.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="groupSize">Group Size *</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    min="1"
                    max="50"
                    {...register('groupSize', { valueAsNumber: true })}
                    placeholder="Number of players"
                  />
                  {errors.groupSize && (
                    <p className="text-sm text-destructive mt-1">{errors.groupSize.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => setValue('experience', value)} defaultValue={watch('experience')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                <Textarea
                  id="specialRequests"
                  {...register('specialRequests')}
                  placeholder="Any special requests, dietary requirements, accessibility needs, or additional information"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back to Calendar
              </Button>
              <Button type="submit">
                Review Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};