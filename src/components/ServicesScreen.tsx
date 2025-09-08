import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Wrench, ArrowRight, Clock, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'electricity' | 'plumbing';
}

interface ServicesScreenProps {
  onServiceSelect: (service: Service) => void;
  onBack: () => void;
}

const ServicesScreen = ({ onServiceSelect, onBack }: ServicesScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'electricity' | 'plumbing'>('electricity');

  const services: Service[] = [
    // Electricity Services
    {
      id: 'elec-1',
      name: 'مد و سحب الأسلاك الداخلية (التأسيس)',
      description: 'تأسيس وتمديد الأسلاك الكهربائية للمباني الجديدة والتجديدات',
      price: '200-500 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-2',
      name: 'تركيب اللمبات و النجف و وحدات الإضاءة',
      description: 'تركيب جميع أنواع الإضاءة والثريات ووحدات الإنارة الحديثة',
      price: '150-400 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-3',
      name: 'صيانة الأعطال (انقطاع الكهرباء – القفلات)',
      description: 'إصلاح انقطاع التيار الكهربائي وأعطال القفلات والتوصيلات',
      price: '100-300 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-4',
      name: 'تركيب لوحات توزيع الكهرباء و القواطع (الأوتوماتيك)',
      description: 'تركيب وصيانة لوحات التوزيع والقواطع الأوتوماتيكية',
      price: '300-800 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-5',
      name: 'تركيب سخانات كهربائية و غسالات و أجهزة المطبخ',
      description: 'توصيل وتركيب الأجهزة الكهربائية المنزلية بأمان',
      price: '200-500 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-6',
      name: 'إصلاح أو تغيير الأسلاك القديمة التالفة',
      description: 'استبدال وإصلاح الأسلاك القديمة والتالفة لضمان السلامة',
      price: '250-600 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-7',
      name: 'تركيب مراوح سقف و شفاطات',
      description: 'تركيب مراوح السقف وشفاطات المطابخ والحمامات',
      price: '150-350 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-8',
      name: 'ضبط و تركيب أجراس الأبواب',
      description: 'تركيب وصيانة أجراس الأبواب الكهربائية والذكية',
      price: '100-250 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-9',
      name: 'تركيب وحدات تكييف (التوصيل الكهربائي فقط)',
      description: 'التوصيل الكهربائي لوحدات التكييف مع ضمان السلامة',
      price: '200-400 جنيه',
      duration: '',
      category: 'electricity'
    },
    {
      id: 'elec-10',
      name: 'تركيب و صيانة مفاتيح الكهرباء و البرايز',
      description: 'تركيب وإصلاح جميع أنواع المفاتيح والمقابس الكهربائية',
      price: '80-200 جنيه',
      duration: '',
      category: 'electricity'
    },
    // Plumbing Services
    {
      id: 'plumb-1',
      name: 'إصلاح تسريب المياه من الحنفيات و الخلاطات',
      description: 'كشف وإصلاح تسريبات المياه من جميع أنواع الحنفيات والخلاطات',
      price: '150-350 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-2',
      name: 'تغيير الحنفيات و الخلاطات',
      description: 'استبدال وتركيب حنفيات وخلاطات جديدة بأحدث التقنيات',
      price: '200-500 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-3',
      name: 'تسليك المواسير و البالوعات المسدودة',
      description: 'تسليك وتنظيف المواسير والمجاري المسدودة بأحدث المعدات',
      price: '200-400 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-4',
      name: 'تركيب أحواض و مراحيض و بانيو و دوش',
      description: 'تركيب جميع أدوات الحمام والمطبخ الصحية',
      price: '300-700 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-5',
      name: 'إصلاح أو تغيير طلمبات المياه',
      description: 'صيانة وتركيب طلمبات المياه وضمان كفاءة التشغيل',
      price: '250-600 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-6',
      name: 'مد مواسير المياه (التأسيس)',
      description: 'تمديد شبكات المياه للمباني الجديدة والتوسعات',
      price: '300-800 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-7',
      name: 'صيانة و تركيب سخانات الغاز و توصيلاتها المائية',
      description: 'تركيب وصيانة سخانات الغاز مع ضمان السلامة',
      price: '350-700 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-8',
      name: 'تركيب فلاتر مياه و توصيلاتها',
      description: 'تركيب أنظمة تنقية المياه مع التوصيلات المطلوبة',
      price: '200-500 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-9',
      name: 'إصلاح أو تغيير خراطيم السيفون و الوصلات المرنة',
      description: 'استبدال وإصلاح خراطيم السيفون والوصلات المرنة',
      price: '100-250 جنيه',
      duration: '',
      category: 'plumbing'
    },
    {
      id: 'plumb-10',
      name: 'معالجة ضعف ضغط المياه',
      description: 'تشخيص وحل مشاكل ضعف ضغط المياه في المنزل',
      price: '200-400 جنيه',
      duration: '',
      category: 'plumbing'
    }
  ];

  const filteredServices = services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة
        </Button>

        <div className="text-center mb-8 animate-fade-in arabic">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            خدمات الصيانة المنزلية
          </h1>
          <p className="text-muted-foreground">
            اختر الخدمة التي تحتاجها وسنرسل لك أفضل الفنيين
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-2xl p-1 shadow-lg">
            <Button
              variant={selectedCategory === 'electricity' ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory('electricity')}
              className={`rounded-xl px-8 py-3 arabic transition-all duration-300 ${
                selectedCategory === 'electricity' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-muted'
              }`}
            >
              <Zap className="ml-2 h-5 w-5" />
              خدمات الكهرباء
            </Button>
            <Button
              variant={selectedCategory === 'plumbing' ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory('plumbing')}
              className={`rounded-xl px-8 py-3 arabic transition-all duration-300 ${
                selectedCategory === 'plumbing' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-muted'
              }`}
            >
              <Wrench className="ml-2 h-5 w-5" />
              خدمات السباكة
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {filteredServices.map((service, index) => (
            <Card 
              key={service.id} 
              className="hover:shadow-xl transition-all duration-300 border-0 bg-card/95 backdrop-blur-sm group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onServiceSelect(service)}
            >
              <CardHeader className="arabic">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                  <div className={`p-3 rounded-full ${
                    selectedCategory === 'electricity' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-accent/10 text-accent'
                  }`}>
                    {selectedCategory === 'electricity' ? (
                      <Zap className="h-6 w-6" />
                    ) : (
                      <Wrench className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="arabic">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Badge variant="secondary" className="font-bold">
                      {service.price}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full btn-hero group-hover:shadow-lg transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceSelect(service);
                    }}
                  >
                    <CheckCircle className="ml-2 h-4 w-4" />
                    احجز الخدمة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <h3 className="text-lg font-bold text-foreground mb-2 arabic">
            تحتاج مساعدة في اختيار الخدمة المناسبة؟
          </h3>
          <p className="text-muted-foreground arabic">
            تواصل معنا وسنساعدك في اختيار الخدمة المناسبة لمنزلك
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesScreen;