import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center arabic space-y-6">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">عذراً! الصفحة غير موجودة</p>
        <Button 
          asChild
          className="btn-hero"
        >
          <a href="/">العودة للرئيسية</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
