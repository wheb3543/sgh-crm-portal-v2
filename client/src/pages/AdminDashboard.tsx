import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  Search, 
  LogOut,
  TrendingUp,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

const statusLabels = {
  new: "جديد",
  contacted: "تم التواصل",
  booked: "تم الحجز",
  not_interested: "غير مهتم",
  no_answer: "لم يرد",
};

const statusColors = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  booked: "bg-green-500",
  not_interested: "bg-red-500",
  no_answer: "bg-gray-500",
};

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = trpc.leads.list.useQuery();
  const { data: stats } = trpc.leads.stats.useQuery();

  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة العميل بنجاح");
      refetchLeads();
      setStatusDialogOpen(false);
      setSelectedLead(null);
      setNewStatus("");
      setStatusNotes("");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    },
  });

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!searchTerm) return leads;
    
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.fullName.toLowerCase().includes(term) ||
        lead.phone.includes(term) ||
        (lead.email && lead.email.toLowerCase().includes(term))
    );
  }, [leads, searchTerm]);

  const handleStatusUpdate = () => {
    if (!selectedLead || !newStatus) return;
    
    updateStatusMutation.mutate({
      id: selectedLead.id,
      status: newStatus as any,
      notes: statusNotes || undefined,
    });
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <img 
              src="/assets/logo-color.png" 
              alt="المستشفى السعودي الألماني" 
              className="h-20 mx-auto mb-4"
            />
            <CardTitle className="text-2xl">لوحة التحكم الإدارية</CardTitle>
            <CardDescription>يرجى تسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/logo-color.png" 
                alt="المستشفى السعودي الألماني" 
                className="h-12"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">لوحة التحكم الإدارية</h1>
                <p className="text-sm text-muted-foreground">إدارة حملات التسويق والعملاء</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">إجمالي العملاء</p>
                  <p className="text-3xl font-bold text-primary">{stats?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">جديد</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.new || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">تم التواصل</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats?.contacted || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">تم الحجز</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.booked || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">غير مهتم</p>
                  <p className="text-3xl font-bold text-red-600">{stats?.notInterested || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>قائمة العملاء المسجلين</CardTitle>
                <CardDescription>إدارة ومتابعة جميع العملاء المسجلين في الحملات</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="بحث بالاسم، الهاتف، أو البريد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-80"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">
                  {searchTerm ? "لا توجد نتائج للبحث" : "لا يوجد عملاء مسجلين بعد"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ التسجيل</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.fullName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span dir="ltr">{lead.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.email ? (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{lead.email}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">غير متوفر</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-white`}>
                            {statusLabels[lead.status as keyof typeof statusLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(lead.createdAt).toLocaleDateString("ar-YE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedLead(lead);
                                setNewStatus(lead.status);
                                setStatusDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              تحديث الحالة
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تحديث حالة العميل</DialogTitle>
            <DialogDescription>
              قم بتحديث حالة العميل وإضافة ملاحظات إذا لزم الأمر
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold">معلومات العميل:</h4>
                <div className="bg-muted rounded-lg p-3 space-y-1">
                  <p className="text-sm"><span className="font-semibold">الاسم:</span> {selectedLead.fullName}</p>
                  <p className="text-sm"><span className="font-semibold">الهاتف:</span> {selectedLead.phone}</p>
                  {selectedLead.email && (
                    <p className="text-sm"><span className="font-semibold">البريد:</span> {selectedLead.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة الجديدة</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">جديد</SelectItem>
                    <SelectItem value="contacted">تم التواصل</SelectItem>
                    <SelectItem value="booked">تم الحجز</SelectItem>
                    <SelectItem value="not_interested">غير مهتم</SelectItem>
                    <SelectItem value="no_answer">لم يرد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea
                  id="notes"
                  placeholder="أضف أي ملاحظات حول هذا التحديث..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusDialogOpen(false);
                    setSelectedLead(null);
                    setNewStatus("");
                    setStatusNotes("");
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
