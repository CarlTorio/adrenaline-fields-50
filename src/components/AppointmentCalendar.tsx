import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isSameDay, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface AppointmentCalendarProps {
  onDateTimeSelect: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onDateTimeSelect,
  selectedDate,
  selectedTime,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(
    selectedDate ? parseISO(selectedDate) : undefined
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(selectedTime || '');
  const [bookedSlots, setBookedSlots] = useState<{[key: string]: string[]}>({});
  const [unavailableSchedules, setUnavailableSchedules] = useState<any[]>([]);

  // Time slots for appointments
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    // Load booked appointments and unavailable schedules
    loadBookedAppointments();
    loadUnavailableSchedules();
  }, []);

  const loadBookedAppointments = () => {
    try {
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const bookedByDate: {[key: string]: string[]} = {};
      
      appointments.forEach((apt: any) => {
        if (apt.status !== "Didn't show up") {
          const dateKey = apt.appointment_date;
          if (!bookedByDate[dateKey]) {
            bookedByDate[dateKey] = [];
          }
          bookedByDate[dateKey].push(apt.appointment_time);
        }
      });
      
      setBookedSlots(bookedByDate);
    } catch (error) {
      console.error('Error loading booked appointments:', error);
    }
  };

  const loadUnavailableSchedules = () => {
    try {
      const schedules = JSON.parse(localStorage.getItem('unavailable_schedules') || '[]');
      setUnavailableSchedules(schedules);
    } catch (error) {
      console.error('Error loading unavailable schedules:', error);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 60); // 2 months in advance
    
    // Disable past dates and dates more than 2 months ahead
    if (isBefore(date, today) || isAfter(date, maxDate)) {
      return true;
    }

    // Disable Sundays (0 = Sunday)
    if (date.getDay() === 0) {
      return true;
    }

    // Check if entire day is unavailable
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableSchedules.some(schedule => 
      schedule.unavailable_date === dateStr && schedule.is_full_day
    );
  };

  const isTimeSlotAvailable = (time: string) => {
    if (!selected) return false;
    
    const selectedDateStr = format(selected, 'yyyy-MM-dd');
    
    // Check if time is already booked
    const bookedTimes = bookedSlots[selectedDateStr] || [];
    if (bookedTimes.includes(time)) {
      return false;
    }

    // Check if time is in unavailable schedules
    const isUnavailable = unavailableSchedules.some(schedule => 
      schedule.unavailable_date === selectedDateStr && 
      !schedule.is_full_day && 
      schedule.unavailable_time === time
    );

    return !isUnavailable;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelected(date);
    setSelectedTimeSlot(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const handleContinue = () => {
    if (selected && selectedTimeSlot) {
      const dateStr = format(selected, 'yyyy-MM-dd');
      onDateTimeSelect(dateStr, selectedTimeSlot);
    }
  };

  const getAvailableTimesCount = () => {
    if (!selected) return 0;
    return timeSlots.filter(time => isTimeSlotAvailable(time)).length;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Select Date</h3>
            </div>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>• Appointments available Monday - Saturday</p>
              <p>• Book up to 2 months in advance</p>
              <p>• Morning: 9:00 AM - 12:00 PM</p>
              <p>• Afternoon: 2:00 PM - 5:30 PM</p>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Select Time</h3>
              </div>
              {selected && (
                <Badge variant="outline">
                  {getAvailableTimesCount()} available
                </Badge>
              )}
            </div>
            
            {!selected ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Please select a date first</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  {format(selected, 'EEEE, MMMM d, yyyy')}
                </div>
                
                {getAvailableTimesCount() === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No available times for this date</p>
                    <p className="text-xs">Please select another date</p>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">Morning</div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {timeSlots.filter(time => time < '12:00').map((time) => (
                        <Button
                          key={time}
                          variant={selectedTimeSlot === time ? "default" : "outline"}
                          size="sm"
                          disabled={!isTimeSlotAvailable(time)}
                          onClick={() => handleTimeSelect(time)}
                          className="h-8 text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">Afternoon</div>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.filter(time => time >= '14:00').map((time) => (
                        <Button
                          key={time}
                          variant={selectedTimeSlot === time ? "default" : "outline"}
                          size="sm"
                          disabled={!isTimeSlotAvailable(time)}
                          onClick={() => handleTimeSelect(time)}
                          className="h-8 text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!selected || !selectedTimeSlot}
          size="lg"
          className="w-48"
        >
          Continue to Patient Info
        </Button>
      </div>
    </div>
  );
};