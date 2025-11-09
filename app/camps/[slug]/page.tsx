/**
 * Individual Camp Landing Page - صفحة المخيم الفردية
 * 
 * Displays detailed information about a specific medical camp with registration form.
 * Features: Camp details, registration form, Meta Pixel integration, WhatsApp integration
 * 
 * @component
 * @param {Object} params - Route parameters
 * @param {string} params.slug - Camp slug
 * @returns {JSX.Element} The camp landing page
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';

/**
 * Camp registration form validation schema
 */
const registrationSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  notes: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

/**
 * CampPage Component
 * 
 * Displays:
 * - Camp information
 * - Camp image
 * - Dates and location
 * - Registration form
 * - Meta Pixel tracking
 */
export default function CampPage({ params }: { params: { slug: string } }) {
  const [camp, setCamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  // Fetch camp by slug
  const { data: campData } = trpc.camps.getBySlug.useQuery({ slug: params.slug });

  // Create lead mutation for camp registration
  const createLeadMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success('تم التسجيل بنجاح! سيتم التواصل معك قريبًا');
      setRegistrationSubmitted(true);
      reset();

      // Track with Meta Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          value: 0,
          currency: 'SAR',
          content_name: `Camp Registration - ${camp?.name}`,
        });
        (window as any).fbq('track', 'CompleteRegistration', {
          value: 0,
          currency: 'SAR',
          content_name: `Camp Registration - ${camp?.name}`,
        });
      }
    },
    onError: (error) => {
      toast.error('فشل في التسجيل. حاول مرة أخرى');
      console.error(error);
    },
  });

  useEffect(() => {
    if (campData) {
      setCamp(campData);
      setLoading(false);
    }
  }, [campData]);

  const onSubmit = (data: RegistrationFormData) => {
    if (!camp) return;

    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    createLeadMutation.mutate({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || undefined,
      sourceType: 'camp',
      sourceId: camp.id,
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
      notes: data.notes,
    });
  };

  /**
   * Format date to Arabic
   */
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'غير محدد';
    const d = new Date(date);
    return d.toLocaleDateString('ar-YE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  if (!camp) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">لم يتم العثور على المخيم</p>
            <Button onClick={() => window.history.back()}>العودة</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/camps" className="text-green-600 hover:underline">
            ← المخيمات الطبية
          </a>
        </div>
      </div>

      {/* Camp Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camp Image and Info */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {camp.imageUrl && (
                <div className="relative h-96 w-full">
                  <Image
                    src={camp.imageUrl}
                    alt={camp.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-3xl text-green-700">{camp.name}</CardTitle>
                <CardDescription className="text-lg">
                  مخيم طبي خيري مجاني من المستشفى السعودي الألماني - صنعاء
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camp Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">التاريخ</p>
                      <p className="text-sm text-gray-600">
                        من {formatDate(camp.startDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        إلى {formatDate(camp.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">الموقع</p>
                      <p className="text-sm text-gray-600">
                        المستشفى السعودي الألماني
                      </p>
                      <p className="text-sm text-gray-600">صنعاء - اليمن</p>
                    </div>
                  </div>
                </div>

                {/* Camp Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">عن المخيم</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {camp.description || 'مخيم طبي خيري مجاني يقدم خدمات طبية متميزة للمجتمع'}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">مميزات المخيم</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">خدمات طبية مجانية بالكامل</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">كادر طبي متخصص وذو خبرة عالية</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">فحوصات طبية شاملة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">استشارات طبية مجانية</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  سجل الآن
                </CardTitle>
                <CardDescription className="text-green-100">
                  املأ النموذج للتسجيل في المخيم
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {registrationSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      تم التسجيل بنجاح!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      سيتم التواصل معك قريبًا لتأكيد التسجيل
                    </p>
                    <Button
                      onClick={() => setRegistrationSubmitted(false)}
                      variant="outline"
                      className="w-full"
                    >
                      تسجيل شخص آخر
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register('fullName')}
                        placeholder="أدخل اسمك الكامل"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register('phone')}
                        placeholder="967xxxxxxxxx+"
                        dir="ltr"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="example@email.com"
                        dir="ltr"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ملاحظات (اختياري)
                      </label>
                      <Textarea
                        {...register('notes')}
                        placeholder="أي ملاحظات أو استفسارات"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={createLeadMutation.isLoading}
                    >
                      {createLeadMutation.isLoading ? 'جاري التسجيل...' : 'سجل الآن'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      بالتسجيل، أنت توافق على سياسة الخصوصية وشروط الخدمة
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
