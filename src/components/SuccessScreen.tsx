import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Clock, MapPin, Phone, Home } from 'lucide-react';

interface SuccessScreenProps {
  bookingData: any;
  onNewBooking: () => void;
}

const SuccessScreen = ({ bookingData, onNewBooking }: SuccessScreenProps) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Mock technician data - in real app this would come from backend
  const technicianData = {
    name: 'أحمد محمد',
    id: 'TEC-001',
    phone: '01234567890',
    estimatedTime: '15-25 دقيقة',
    rating: 4.8
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Success Animation */}
        <div className={`text-center transition-all duration-1000 ${isAnimated ? 'animate-bounce-in' : 'opacity-0 scale-75'}`}>
          <div className="mx-auto w-24 h-24 bg-success rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
            <CheckCircle className="h-12 w-12 text-success-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground arabic mb-2">
            تم تأكيد الحجز بنجاح!
          </h1>
          <p className="text-muted-foreground arabic">
            سيصلك الفني قريباً
          </p>
        </div>

        {/* Booking Summary */}
        <Card className={`border-0 bg-card/95 backdrop-blur-sm shadow-xl transition-all duration-700 delay-300 ${isAnimated ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          <CardHeader className="arabic text-center">
            <CardTitle className="text-lg font-bold text-foreground">
              تفاصيل الحجز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 arabic">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الخدمة:</span>
                <span className="font-medium">{bookingData.service.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">السعر:</span>
                <Badge variant="secondary">{bookingData.service.price}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">العميل:</span>
                <span className="font-medium">{bookingData.customerData.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technician Info */}
        <Card className={`border-0 bg-card/95 backdrop-blur-sm shadow-xl transition-all duration-700 delay-500 ${isAnimated ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}>
          <CardHeader className="arabic text-center">
            <CardTitle className="text-lg font-bold text-foreground">
              بيانات الفني المختص
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 arabic">
                <div className="font-bold text-foreground">{technicianData.name}</div>
                <div className="text-sm text-muted-foreground">
                  معرف الفني: {technicianData.id}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-accent">★</span>
                  <span className="text-muted-foreground">{technicianData.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 arabic">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  الوصول خلال: <span className="font-medium text-primary">{technicianData.estimatedTime}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm" dir="ltr">{technicianData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">في طريقه إليك الآن</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className={`space-y-3 transition-all duration-700 delay-700 ${isAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
          <Button 
            onClick={onNewBooking}
            className="w-full btn-hero text-lg py-6 arabic font-bold"
          >
            <Home className="ml-2 h-5 w-5" />
            حجز خدمة جديدة
          </Button>
          <p className="text-center text-sm text-muted-foreground arabic">
            شكراً لثقتك في فيكسي - خدمات الصيانة المنزلية
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-success/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default SuccessScreen;