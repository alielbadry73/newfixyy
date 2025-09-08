import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface StaffJobsProps {
  session: Session;
}

const StaffJobs = ({ session }: StaffJobsProps) => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-foreground mb-6 arabic text-center">
        الأعمال والأرباح
      </h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            أرباح الشهر الحالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">0 جنيه</div>
          <p className="text-sm text-muted-foreground arabic">لم تكمل أي أعمال بعد</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="arabic">الأعمال المكتملة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground arabic text-center py-4">
            لا توجد أعمال مكتملة
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffJobs;