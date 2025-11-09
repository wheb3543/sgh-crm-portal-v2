/**
 * Admin Camps Management - إدارة المخيمات الطبية
 * 
 * This page allows admins to manage medical camps.
 * Features: Create, Read, Update, Delete (CRUD) operations
 * 
 * @component
 * @returns {JSX.Element} The camps management page
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

/**
 * AdminCampsPage Component
 * 
 * Displays a management interface for medical camps with:
 * - List of all camps
 * - Add new camp form
 * - Edit camp functionality
 * - Delete camp functionality
 */
export default function AdminCampsPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Fetch camps
  const { data: campsData, refetch } = trpc.camps.getAll.useQuery();

  useEffect(() => {
    if (campsData) {
      setCamps(campsData);
    }
  }, [campsData]);

  // Create mutation
  const createMutation = trpc.camps.create.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء المخيم بنجاح');
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error('فشل في إنشاء المخيم: ' + error.message);
      console.error(error);
    },
  });

  // Update mutation
  const updateMutation = trpc.camps.update.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث المخيم بنجاح');
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error('فشل في تحديث المخيم: ' + error.message);
      console.error(error);
    },
  });

  // Delete mutation
  const deleteMutation = trpc.camps.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف المخيم بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error('فشل في حذف المخيم');
      console.error(error);
    },
  });

  // Deactivate mutation
  const deactivateMutation = trpc.camps.deactivate.useMutation({
    onSuccess: () => {
      toast.success('تم إلغاء تفعيل المخيم بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error('فشل في إلغاء تفعيل المخيم');
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (camp: any) => {
    setFormData({
      name: camp.name,
      description: camp.description || '',
      imageUrl: camp.imageUrl || '',
      startDate: camp.startDate ? new Date(camp.startDate).toISOString().split('T')[0] : '',
      endDate: camp.endDate ? new Date(camp.endDate).toISOString().split('T')[0] : '',
      isActive: camp.isActive,
    });
    setEditingId(camp.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const campData = {
      name: formData.name,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
    };

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...campData,
      });
    } else {
      createMutation.mutate(campData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المخيم؟')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDeactivate = (id: number) => {
    if (confirm('هل أنت متأكد من إلغاء تفعيل هذا المخيم؟')) {
      deactivateMutation.mutate({ id });
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المخيمات الطبية</h1>
          <p className="text-gray-600 mt-2">إضافة وتعديل وحذف المخيمات الطبية</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          {showForm ? 'إلغاء' : 'إضافة مخيم جديد'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'تعديل المخيم' : 'إضافة مخيم جديد'}</CardTitle>
            <CardDescription>
              {editingId ? 'قم بتعديل بيانات المخيم' : 'املأ البيانات لإضافة مخيم جديد'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم المخيم <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مخيم الجراحة العامة"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف تفصيلي للمخيم والخدمات المقدمة"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ البداية</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ النهاية</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Camps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {camps.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">لا توجد مخيمات حالياً</p>
            </CardContent>
          </Card>
        ) : (
          camps.map((camp) => (
            <Card key={camp.id} className="overflow-hidden">
              <CardHeader className={camp.isActive ? 'bg-green-50' : 'bg-gray-50'}>
                <CardTitle className="text-xl">{camp.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {camp.description || 'لا يوجد وصف'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>من {formatDate(camp.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>إلى {formatDate(camp.endDate)}</span>
                  </div>
                  <div className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded ${
                      camp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {camp.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(camp)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  {camp.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeactivate(camp.id)}
                      className="flex-1"
                    >
                      إلغاء تفعيل
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(camp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Link href={`/camps/${camp.slug}`} target="_blank" className="block mt-2">
                  <Button size="sm" variant="link" className="w-full text-green-600">
                    عرض الصفحة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
