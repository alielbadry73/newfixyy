import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Phone, MessageSquare, ArrowRight, Navigation } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'electricity' | 'plumbing';
}

interface BookingScreenProps {
  service: Service;
  onBookingSubmit: (bookingData: any) => void;
  onBack: () => void;
}

const BookingScreen = ({ service, onBookingSubmit, onBack }: BookingScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    location: null as { lat: number; lng: number } | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          // Handle location error gracefully
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('الموقع الجغرافي غير مدعوم في هذا المتصفح');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onBookingSubmit({
        service,
        customerData: formData,
        bookingTime: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للخدمات
        </Button>

        <div className="space-y-6 animate-fade-in">
          {/* Service Summary */}
          <Card className="border-0 bg-card/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="arabic">
              <CardTitle className="text-xl font-bold text-foreground">
                تأكيد الحجز
              </CardTitle>
              <CardDescription>
                راجع تفاصيل الخدمة وأكمل بياناتك
              </CardDescription>
            </CardHeader>
            <CardContent className="arabic">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {service.price}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>المدة المتوقعة: {service.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="border-0 bg-card/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="arabic">
              <CardTitle className="text-lg font-bold text-foreground">
                بيانات العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="الاسم الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pr-10 arabic text-right"
                      dir="rtl"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive arabic">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pr-10 text-left"
                      dir="ltr"
                      maxLength={11}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive arabic">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="العنوان التفصيلي (الحي، الشارع، رقم العقار، الدور)"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="pr-10 arabic text-right resize-none"
                      dir="rtl"
                      rows={3}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-sm text-destructive arabic">{errors.address}</p>
                  )}
                </div>

                {/* Location Detection */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full arabic"
                  >
                    <Navigation className="ml-2 h-4 w-4" />
                    {isGettingLocation ? 'جاري تحديد الموقع...' : 'تحديد موقعي الحالي'}
                  </Button>
                  {formData.location && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <MapPin className="h-4 w-4" />
                      <span className="arabic">تم تحديد الموقع بنجاح</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <div className="relative">
                    <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="ملاحظات إضافية (اختياري)"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="pr-10 arabic text-right resize-none"
                      dir="rtl"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full btn-hero text-lg py-6 arabic font-bold"
                >
                  تأكيد الحجز
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-0 bg-primary/5">
            <CardContent className="p-4">
              <div className="text-center arabic">
                <p className="text-sm text-muted-foreground">
                  سيتم التواصل معك خلال دقائق لتأكيد الموعد وإرسال الفني المختص
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;