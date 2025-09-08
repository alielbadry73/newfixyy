import { useState } from 'react';
import { Home, CheckSquare, User } from 'lucide-react';
import ServicesScreen from './ServicesScreen';
import CustomerTodos from './CustomerTodos';
import CustomerProfile from './CustomerProfile';
import { Session } from '@supabase/supabase-js';

interface CustomerAppProps {
  session: Session;
}

type CustomerScreen = 'services' | 'todos' | 'profile';

const CustomerApp = ({ session }: CustomerAppProps) => {
  const [currentScreen, setCurrentScreen] = useState<CustomerScreen>('services');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'services':
        return <ServicesScreen onServiceSelect={() => {}} onBack={() => {}} />;
      case 'todos':
        return <CustomerTodos session={session} />;
      case 'profile':
        return <CustomerProfile session={session} />;
      default:
        return <ServicesScreen onServiceSelect={() => {}} onBack={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setCurrentScreen('services')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              currentScreen === 'services' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs arabic">الخدمات</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('todos')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              currentScreen === 'todos' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckSquare className="h-5 w-5 mb-1" />
            <span className="text-xs arabic">المهام</span>
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

export default CustomerApp;