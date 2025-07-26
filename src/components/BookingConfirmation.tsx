import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, User, Phone, Mail, Target, AlertCircle, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { BookingData } from './BookingModal';
import { useToast } from '@/hooks/use-toast';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onClose: () => void;
  onBack: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  onClose,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the booking
      const bookingId = Date.now().toString();
      
      const booking = {
        id: bookingId,
        ...bookingData,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        booked_at: new Date().toISOString(),
      };

      // Save to localStorage (in a real app, this would be saved to a database)
      const existingBookings = JSON.parse(localStorage.getItem('paintball_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('paintball_bookings', JSON.stringify(existingBookings));

      toast({
        title: "Paintball Session Booked Successfully!",
        description: "You will receive a confirmation call within 24 hours to finalize details.",
      });

      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error booking paintball session:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your paintball session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600">Battle Ready!</h2>
        <p className="text-muted-foreground">Please review your paintball session details</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Session DateTime */}
          <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{formatDate(bookingData.bookingDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{formatTime(bookingData.bookingTime)}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium">{bookingData.customerName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {bookingData.phone}
                </p>
              </div>
              
              {bookingData.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {bookingData.email}
                  </p>
                </div>
              )}
              
              {bookingData.emergencyContact && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                  <p className="font-medium">{bookingData.emergencyContact}</p>
                </div>
              )}
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Paintball Session Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service Package</label>
                <p className="font-medium">
                  <Badge variant="outline">{bookingData.service}</Badge>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Group Size</label>
                <p className="font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {bookingData.groupSize} {bookingData.groupSize === 1 ? 'Player' : 'Players'}
                </p>
              </div>
              
              {bookingData.experience && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                  <p className="font-medium">{bookingData.experience}</p>
                </div>
              )}
            </div>
            
            {bookingData.specialRequests && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
                <p className="font-medium">{bookingData.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important Notice:</p>
              <ul className="text-yellow-700 mt-1 space-y-1">
                <li>• You will receive a confirmation call within 24 hours</li>
                <li>• Arrive 30 minutes early for safety briefing and equipment fitting</li>
                <li>• Wear closed-toe shoes and comfortable clothing that can get dirty</li>
                <li>• All safety equipment is provided (mask, vest, gun, air tank)</li>
                <li>• Additional bullets can be purchased on-site (P 5.00 each)</li>
                <li>• Minimum age requirement: 10 years old with adult supervision</li>
                <li>• Weather-dependent activity - we'll contact you if conditions are unsafe</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back to Edit
        </Button>
        <Button 
          onClick={handleConfirmBooking} 
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
};