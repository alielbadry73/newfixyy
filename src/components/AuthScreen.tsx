import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Lock, User, ArrowRight, Wrench, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthScreenProps {
  onAuthSuccess: (userType: 'customer' | 'staff', session: Session) => void;
  onBack: () => void;
}

const AuthScreen = ({ onAuthSuccess, onBack }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'staff'>('customer');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    serviceType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved credentials if remember password is enabled
  useEffect(() => {
    const savedCredentials = localStorage.getItem('fixy_remember_password');
    if (savedCredentials) {
      const { phone, password } = JSON.parse(savedCredentials);
      setFormData(prev => ({ ...prev, phone, password }));
      setRememberPassword(true);
    }
  }, []);

  const validateEgyptianPhone = (phone: string): boolean => {
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 10;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newErrors: Record<string, string> = {};

    // Validate phone
    if (!validateEgyptianPhone(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقماً';
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تكون 10 أحرف على الأقل';
    }

    // Validate name for sign up
    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    // Validate service type for staff sign up
    if (isSignUp && userType === 'staff' && !formData.serviceType) {
      newErrors.serviceType = 'نوع الخدمة مطلوب';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (isSignUp) {
          // Sign up with phone as email
          const { data, error } = await supabase.auth.signUp({
            email: `${formData.phone}@fixy.com`,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth-callback`,
              data: {
                phone: formData.phone,
                name: formData.name,
                user_type: userType,
                service_type: formData.serviceType || null,
                created_at: new Date().toISOString()
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            // Check if we have a session (auto-confirm is enabled)
            if (data.session) {
              // Create user profile in appropriate table
              try {
                if (userType === 'customer') {
                  const { error: profileError } = await supabase
                    .from('customers')
                    .insert({
                      user_id: data.user.id,
                      name: formData.name,
                      phone: formData.phone
                    });
                  if (profileError) throw profileError;
                } else {
                  const { error: profileError } = await supabase
                    .from('staff')
                .insert({
                  user_id: data.user.id,
                  name: formData.name,
                  phone: formData.phone,
                  service_type: formData.serviceType
                });
                  if (profileError) throw profileError;
                }

                if (rememberPassword) {
                  localStorage.setItem('fixy_remember_password', JSON.stringify({
                    phone: formData.phone,
                    password: formData.password
                  }));
                }

                toast({
                  title: "تم إنشاء الحساب بنجاح",
                  description: "مرحباً بك في فيكسي!"
                });

                onAuthSuccess(userType, data.session);
              } catch (profileError: any) {
                console.error('Profile creation error:', profileError);
                // We can't delete the user from client side, but we can log the issue
                toast({
                  title: "خطأ",
                  description: "فشل في إنشاء الملف الشخصي",
                  variant: "destructive"
                });
              }
            } else {
              // No session means email confirmation is required
              toast({
                title: "تم إرسال رابط التأكيد",
                description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك"
              });
            }
          }
        } else {
          // Sign in
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: `${formData.phone}@fixy.com`,
              password: formData.password
            });

            if (error) throw error;

            if (data.session) {
              // Determine user type by checking which table has the user
              const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .select('*')
                .eq('user_id', data.user.id)
                .single();

              if (customerError && customerError.code !== 'PGRST116') { // PGRST116 is not found error
                throw customerError;
              }

              const currentUserType = customerData ? 'customer' : 'staff';

              if (rememberPassword) {
                localStorage.setItem('fixy_remember_password', JSON.stringify({
                  phone: formData.phone,
                  password: formData.password
                }));
              } else {
                localStorage.removeItem('fixy_remember_password');
              }

              toast({
                title: "تم تسجيل الدخول بنجاح",
                description: "أهلاً بعودتك!"
              });

              onAuthSuccess(currentUserType, data.session);
              }
            }
          } catch (signInError: any) {
            console.error('Sign in error:', signInError);
            toast({
              title: "خطأ في تسجيل الدخول",
              description: signInError.message === 'Invalid login credentials' 
                ? 'بيانات الدخول غير صحيحة' 
                : 'حدث خطأ أثناء تسجيل الدخول',
              variant: "destructive"
            });
          }
        } catch (error: any) {
        console.error('Auth error:', error);
        toast({
          title: "خطأ",
          description: error.message === 'User already registered' 
            ? 'هذا الرقم مسجل مسبقاً' 
            : error.message === 'Invalid login credentials'
            ? 'بيانات الدخول غير صحيحة'
            : 'حدث خطأ أثناء العملية',
          variant: "destructive"
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة
        </Button>

        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center arabic">
            <div className="mx-auto w-16 h-16 mb-4">
              <img 
                src="/lovable-uploads/1c139078-11da-4937-b738-d092ba1763f9.png"
                alt="Fixy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isSignUp ? 'انضم إلى عائلة فيكسي للصيانة المنزلية' : 'أهلاً بعودتك إلى فيكسي'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isSignUp ? 'signup' : 'signin'} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="signup" 
                  onClick={() => setIsSignUp(true)}
                  className="arabic"
                >
                  حساب جديد
                </TabsTrigger>
                <TabsTrigger 
                  value="signin" 
                  onClick={() => setIsSignUp(false)}
                  className="arabic"
                >
                  تسجيل دخول
                </TabsTrigger>
              </TabsList>

              {/* User Type Selection */}
              {isSignUp && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={userType === 'customer' ? 'default' : 'outline'}
                      onClick={() => setUserType('customer')}
                      className="flex items-center gap-2 arabic h-12"
                    >
                      <Users className="h-4 w-4" />
                      عميل
                    </Button>
                    <Button
                      type="button"
                      variant={userType === 'staff' ? 'default' : 'outline'}
                      onClick={() => setUserType('staff')}
                      className="flex items-center gap-2 arabic h-12"
                    >
                      <Wrench className="h-4 w-4" />
                      فني
                    </Button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
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
                        disabled={loading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive arabic">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* Service Type for Staff */}
                {isSignUp && userType === 'staff' && (
                  <div className="space-y-2">
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                      <SelectTrigger className="arabic text-right">
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity" className="arabic">كهرباء</SelectItem>
                        <SelectItem value="plumbing" className="arabic">سباكة</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.serviceType && (
                      <p className="text-sm text-destructive arabic">{errors.serviceType}</p>
                    )}
                  </div>
                )}

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
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive arabic">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground arabic">
                    أدخل رقم هاتفك المصري (01xxxxxxxxx)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10 arabic text-right"
                      dir="rtl"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive arabic">{errors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground arabic">
                    كلمة المرور يجب أن تكون 10 أحرف على الأقل
                  </p>
                </div>

                {/* Remember Password Checkbox */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="remember" 
                    checked={rememberPassword}
                    onCheckedChange={(checked) => setRememberPassword(checked as boolean)}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground arabic cursor-pointer">
                    تذكر كلمة المرور
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-hero text-lg py-6 arabic font-bold"
                  disabled={loading}
                >
                  {loading ? 'جاري المعالجة...' : (isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول')}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;