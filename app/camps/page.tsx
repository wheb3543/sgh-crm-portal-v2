/**
 * Camps List Page - صفحة قائمة المخيمات الطبية
 * 
 * Displays all medical camps with filtering capabilities.
 * Features: Filter by status (current/upcoming), responsive grid layout
 * 
 * @component
 * @returns {JSX.Element} The camps list page
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { Calendar, MapPin, Users } from 'lucide-react';

/**
 * CampsPage Component
 * 
 * Displays:
 * - Filter by camp status (current/upcoming)
 * - Grid of camp cards with images
 * - Direct links to individual camp pages
 */
export default function CampsPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch camps from tRPC
  const { data: campsData, isLoading } = trpc.camps.getAll.useQuery();

  useEffect(() => {
    if (campsData) {
      setCamps(campsData);
      filterCamps(campsData, 'all');
    }
  }, [campsData]);

  /**
   * Filter camps based on status (current/upcoming/all)
   */
  const filterCamps = (data: any[], status: string) => {
    let filtered = data;
    const now = new Date();

    if (status === 'current') {
      filtered = filtered.filter((camp) => {
        const startDate = camp.startDate ? new Date(camp.startDate) : null;
        const endDate = camp.endDate ? new Date(camp.endDate) : null;
        return startDate && endDate && startDate <= now && now <= endDate;
      });
    } else if (status === 'upcoming') {
      filtered = filtered.filter((camp) => {
        const startDate = camp.startDate ? new Date(camp.startDate) : null;
        return startDate && startDate > now;
      });
    }

    setFilteredCamps(filtered);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    filterCamps(camps, value);
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">المخيمات الطبية الخيرية</h1>
          <p className="text-xl text-green-100">
            انضم إلى مخيماتنا الطبية المجانية وتمتع بخدمات طبية عالية الجودة
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>تصفية المخيمات</CardTitle>
            <CardDescription>اختر نوع المخيمات التي تريد عرضها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('all')}
              >
                جميع المخيمات
              </Button>
              <Button
                variant={filterStatus === 'current' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('current')}
              >
                المخيمات الحالية
              </Button>
              <Button
                variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('upcoming')}
              >
                المخيمات القادمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camps Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">جاري تحميل المخيمات...</p>
          </div>
        ) : filteredCamps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">لا توجد مخيمات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCamps.map((camp) => (
              <Card key={camp.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {camp.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={camp.imageUrl}
                      alt={camp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-green-700">{camp.name}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {camp.description || 'مخيم طبي خيري مجاني'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm">
                        من {formatDate(camp.startDate)} إلى {formatDate(camp.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm">المستشفى السعودي الألماني - صنعاء</span>
                    </div>
                  </div>
                  <Link href={`/camps/${camp.slug}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Users className="mr-2 h-5 w-5" />
                      سجل الآن
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
