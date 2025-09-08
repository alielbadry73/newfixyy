import { useState } from 'react';
import HomeScreen from '@/components/HomeScreen';
import AuthScreen from '@/components/AuthScreen';
import ServicesScreen from '@/components/ServicesScreen';
import BookingScreen from '@/components/BookingScreen';
import SuccessScreen from '@/components/SuccessScreen';
import CustomerApp from '@/components/CustomerApp';
import StaffApp from '@/components/StaffApp';
import { Session } from '@supabase/supabase-js';

type AppState = 'home' | 'auth' | 'services' | 'booking' | 'success' | 'customer_app' | 'staff_app';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'electricity' | 'plumbing';
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = (userType: 'customer' | 'staff', session: Session) => {
    if (userType === 'customer') {
      setCurrentScreen('customer_app');
    } else {
      setCurrentScreen('staff_app');
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentScreen('booking');
  };

  const handleBookingSubmit = (data: any) => {
    setBookingData(data);
    setCurrentScreen('success');
  };

  const handleNewBooking = () => {
    setSelectedService(null);
    setBookingData(null);
    setCurrentScreen('services');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackToServices = () => {
    setCurrentScreen('services');
  };

  const handleBackToAuth = () => {
    setCurrentScreen('auth');
  };

  switch (currentScreen) {
    case 'home':
      return <HomeScreen onGetStarted={handleGetStarted} />;
    
    case 'auth':
      return (
        <AuthScreen 
          onAuthSuccess={handleAuthSuccess} 
          onBack={handleBackToHome}
        />
      );
    
    case 'services':
      return (
        <ServicesScreen 
          onServiceSelect={handleServiceSelect} 
          onBack={handleBackToAuth}
        />
      );
    
    case 'booking':
      return selectedService ? (
        <BookingScreen 
          service={selectedService}
          onBookingSubmit={handleBookingSubmit}
          onBack={handleBackToServices}
        />
      ) : null;
    
    case 'success':
      return bookingData ? (
        <SuccessScreen 
          bookingData={bookingData}
          onNewBooking={handleNewBooking}
        />
      ) : null;
    
    case 'customer_app':
      return <CustomerApp session={{} as Session} />;
    
    case 'staff_app':
      return <StaffApp session={{} as Session} />;
    
    default:
      return <HomeScreen onGetStarted={handleGetStarted} />;
  }
};

export default Index;
