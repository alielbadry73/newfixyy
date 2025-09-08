import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Session } from '@supabase/supabase-js';

interface StaffCurrentProps {
  session: Session;
}

const StaffCurrent = ({ session }: StaffCurrentProps) => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-foreground mb-6 arabic text-center">
        الطلبات الحالية
      </h1>
      
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground arabic text-lg">
            لا توجد طلبات حالياً
          </p>
          <p className="text-sm text-muted-foreground arabic mt-2">
            ستظهر الطلبات الجديدة هنا عند وصولها
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffCurrent;