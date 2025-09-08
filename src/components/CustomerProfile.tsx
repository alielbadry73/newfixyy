import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, MapPin, Lock, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

interface CustomerProfileProps {
  session: Session;
}

const CustomerProfile = ({ session }: CustomerProfileProps) => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: profile.name,
          phone: profile.phone,
          address: profile.address
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث الملف الشخصي بنجاح"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملف الشخصي",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 10) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 10 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setNewPassword('');
      toast({
        title: "تم التحديث",
        description: "تم تحديث كلمة المرور بنجاح"
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactUs = () => {
    window.open('tel:01040450814', '_self');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6 arabic text-center">
        الملف الشخصي
      </h1>

      {/* Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium arabic">الاسم</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="arabic text-right"
              dir="rtl"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium arabic">رقم الهاتف</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="text-left"
              dir="ltr"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium arabic">العنوان</label>
            <Input
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              className="arabic text-right"
              dir="rtl"
              placeholder="العنوان التفصيلي"
            />
          </div>
          
          <Button onClick={updateProfile} disabled={loading} className="w-full arabic">
            {loading ? 'جاري التحديث...' : 'تحديث المعلومات'}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic flex items-center gap-2">
            <Lock className="h-5 w-5" />
            تغيير كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium arabic">كلمة المرور الجديدة</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="arabic text-right"
              dir="rtl"
              placeholder="أدخل كلمة المرور الجديدة (10 أحرف على الأقل)"
            />
          </div>
          
          <Button onClick={updatePassword} disabled={loading} className="w-full arabic">
            {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
          </Button>
        </CardContent>
      </Card>

      {/* Contact Us */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            تواصل معنا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={contactUs} variant="outline" className="w-full arabic flex items-center gap-2">
            <Phone className="h-4 w-4" />
            اتصل بنا: 01040450814
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={signOut} variant="destructive" className="w-full arabic">
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;