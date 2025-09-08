import { useState } from 'react';
import { MapPin, DollarSign, User } from 'lucide-react';
import StaffCurrent from './StaffCurrent';
import StaffJobs from './StaffJobs';
import StaffProfile from './StaffProfile';
import { Session } from '@supabase/supabase-js';

interface StaffAppProps {
  session: Session;
}

type StaffScreen = 'current' | 'jobs' | 'profile';

const StaffApp = ({ session }: StaffAppProps) => {
  const [currentScreen, setCurrentScreen] = useState<StaffScreen>('current');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'current':
        return <StaffCurrent session={session} />;
      case 'jobs':
        return <StaffJobs session={session} />;
      case 'profile':
        return <StaffProfile session={session} />;
      default:
        return <StaffCurrent session={session} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setCurrentScreen('current')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              currentScreen === 'current' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span className="text-xs arabic">الحالي</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('jobs')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              currentScreen === 'jobs' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-5 w-5 mb-1" />
            <span className="text-xs arabic">الأعمال</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              currentScreen === 'profile' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs arabic">الملف الشخصي</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffApp;