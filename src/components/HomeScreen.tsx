import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface HomeScreenProps {
  onGetStarted: () => void;
}

const HomeScreen = ({ onGetStarted }: HomeScreenProps) => {
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-glow)_0%,_transparent_50%)] opacity-20" />
      
      <div className="text-center space-y-8 px-6 arabic">
        {/* Animated Logo */}
        <div className={`transition-all duration-1000 ${isLogoAnimated ? 'animate-bounce-in' : 'opacity-0 scale-75'}`}>
          <div className="relative mx-auto w-48 h-48 mb-6">
            <img 
              src="/lovable-uploads/1c139078-11da-4937-b738-d092ba1763f9.png"
              alt="Fixy - فيكسي صيانة بيتك"
              className="w-full h-full object-contain animate-pulse-glow"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-700 delay-700 ${isLogoAnimated ? 'animate-bounce-in' : 'opacity-0 scale-95'}`}>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="btn-hero text-lg px-12 py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            ابدأ الآن
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default HomeScreen;