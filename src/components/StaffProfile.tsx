import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface StaffProfileProps {
  session: Session;
}

const StaffProfile = ({ session }: StaffProfileProps) => {
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6 arabic text-center">
        الملف الشخصي
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات الفني
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground arabic">
            معلومات الملف الشخصي ستظهر هنا
          </p>
        </CardContent>
      </Card>

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

export default StaffProfile;