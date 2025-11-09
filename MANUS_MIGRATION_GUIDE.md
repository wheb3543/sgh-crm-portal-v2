# دليل نقل المشروع إلى Manus Web Development

**المطور:** وهي (فريق آيديا)  
**المدير العام:** عبدالقوي  
**التاريخ:** 9 نوفمبر 2025

---

## نظرة عامة

هذا الدليل يوضح خطوات نقل مشروع **بوابة CRM للمستشفى السعودي الألماني** إلى منصة Manus Web Development لتمكين الإدارة من واجهة Manus الرسومية.

---

## المتطلبات الأساسية

- جلسة Manus جديدة (لم يتم فيها استدعاء `webdev_init_project` مسبقاً)
- المشروع الحالي في `/home/ubuntu/sgh-crm-portal-backup`
- صلاحيات الوصول إلى GitHub: `abood22828/sgh-crm-portal`

---

## الخطوة 1: إنشاء مشروع Manus جديد

في جلسة Manus جديدة، قم بتنفيذ:

```
استخدم أداة webdev_init_project مع المعاملات التالية:
- project_name: sgh-crm-portal
- project_title: بوابة CRM - المستشفى السعودي الألماني
- features: web-db-user
- description: نظام إلكتروني متكامل لإدارة حملات التسويق وعلاقات العملاء
```

سيتم إنشاء المشروع في `/home/ubuntu/sgh-crm-portal` مع البنية الأساسية.

---

## الخطوة 2: نسخ Schema قاعدة البيانات

### 2.1 نسخ ملف schema الكامل

```bash
# نسخ schema من المشروع القديم
cp /home/ubuntu/sgh-crm-portal-backup/drizzle/schema.ts \
   /home/ubuntu/sgh-crm-portal/drizzle/schema.ts
```

### 2.2 الجداول المطلوبة

يحتوي schema على 10 جداول:

1. **users** - إدارة المستخدمين والصلاحيات
2. **campaigns** - الحملات التسويقية
3. **leads** - العملاء المسجلين
4. **leadStatusHistory** - تاريخ حالات العملاء
5. **settings** - إعدادات النظام
6. **doctors** - معلومات الأطباء
7. **appointments** - حجوزات المواعيد
8. **accessRequests** - طلبات الوصول
9. **offers** - العروض الطبية
10. **camps** - المخيمات الطبية

### 2.3 تطبيق Schema

```bash
cd /home/ubuntu/sgh-crm-portal
pnpm db:push
```

---

## الخطوة 3: نسخ Server Routers

### 3.1 نسخ ملفات Routers

```bash
# نسخ offers router
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/offers.ts \
   /home/ubuntu/sgh-crm-portal/server/routers/offers.ts

# نسخ camps router
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/camps.ts \
   /home/ubuntu/sgh-crm-portal/server/routers/camps.ts
```

### 3.2 تحديث server/routers.ts

أضف الـ routers الجديدة إلى ملف `server/routers.ts`:

```typescript
import { offersRouter } from './routers/offers';
import { campsRouter } from './routers/camps';

export const appRouter = router({
  // ... existing routers
  offers: offersRouter,
  camps: campsRouter,
});
```

### 3.3 نسخ دوال قاعدة البيانات

نسخ الدوال المخصصة من `server/db.ts`:

```bash
# استخراج الدوال المطلوبة من المشروع القديم
# ودمجها مع server/db.ts الجديد
```

الدوال المطلوبة:
- `getAllAppointments()`
- `updateAppointmentStatus()`
- `upsertUser()`
- `getUserByOpenId()`

---

## الخطوة 4: نسخ الصفحات العامة

### 4.1 الصفحة الرئيسية

```bash
cp /home/ubuntu/sgh-crm-portal-backup/app/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/page.tsx
```

### 4.2 صفحات العروض

```bash
# قائمة العروض
cp /home/ubuntu/sgh-crm-portal-backup/app/offers/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/offers/page.tsx

# صفحات هبوط العروض
mkdir -p /home/ubuntu/sgh-crm-portal/app/offers/[slug]
cp /home/ubuntu/sgh-crm-portal-backup/app/offers/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/offers/[slug]/page.tsx
```

### 4.3 صفحات الأطباء

```bash
# قائمة الأطباء
cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/doctors/page.tsx

# صفحات هبوط الأطباء
mkdir -p /home/ubuntu/sgh-crm-portal/app/doctors/[slug]
cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/doctors/[slug]/page.tsx
```

### 4.4 صفحات المخيمات ✨ جديد

```bash
# قائمة المخيمات
mkdir -p /home/ubuntu/sgh-crm-portal/app/camps
cp /home/ubuntu/sgh-crm-portal-backup/app/camps/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/camps/page.tsx

# صفحات هبوط المخيمات
mkdir -p /home/ubuntu/sgh-crm-portal/app/camps/[slug]
cp /home/ubuntu/sgh-crm-portal-backup/app/camps/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/camps/[slug]/page.tsx
```

---

## الخطوة 5: نسخ لوحة التحكم الإدارية

### 5.1 الصفحة الرئيسية للوحة التحكم

```bash
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/admin/page.tsx
```

### 5.2 إدارة العملاء

```bash
mkdir -p /home/ubuntu/sgh-crm-portal/app/admin/leads
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/leads/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/admin/leads/page.tsx
```

### 5.3 إدارة العروض

```bash
mkdir -p /home/ubuntu/sgh-crm-portal/app/admin/offers
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/offers/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/admin/offers/page.tsx
```

### 5.4 إدارة الأطباء

```bash
mkdir -p /home/ubuntu/sgh-crm-portal/app/admin/doctors
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/doctors/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/admin/doctors/page.tsx
```

### 5.5 إدارة المخيمات ✨ جديد

```bash
mkdir -p /home/ubuntu/sgh-crm-portal/app/admin/camps
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/camps/page.tsx \
   /home/ubuntu/sgh-crm-portal/app/admin/camps/page.tsx
```

---

## الخطوة 6: نسخ المكونات والأدوات المساعدة

### 6.1 Utilities

```bash
# نسخ slug utilities
cp /home/ubuntu/sgh-crm-portal-backup/shared/_core/utils/slug.ts \
   /home/ubuntu/sgh-crm-portal/shared/_core/utils/slug.ts
```

### 6.2 Integration Files

```bash
# Meta Pixel & Conversion API
cp /home/ubuntu/sgh-crm-portal-backup/server/facebookConversion.ts \
   /home/ubuntu/sgh-crm-portal/server/facebookConversion.ts

# WhatsApp API
cp /home/ubuntu/sgh-crm-portal-backup/server/whatsapp.ts \
   /home/ubuntu/sgh-crm-portal/server/whatsapp.ts

# Email Service
cp /home/ubuntu/sgh-crm-portal-backup/server/email.ts \
   /home/ubuntu/sgh-crm-portal/server/email.ts
```

### 6.3 الصور والأصول

```bash
# نسخ جميع الصور
cp -r /home/ubuntu/sgh-crm-portal-backup/public/assets/* \
      /home/ubuntu/sgh-crm-portal/public/assets/
```

---

## الخطوة 7: تكوين المتغيرات البيئية

استخدم `webdev_request_secrets` لإضافة المتغيرات التالية:

### متغيرات إلزامية:
- `DATABASE_URL` - رابط قاعدة البيانات MySQL

### متغيرات اختيارية (للتكاملات):
- `META_PIXEL_ID` - معرف Meta Pixel
- `META_ACCESS_TOKEN` - رمز الوصول لـ Conversion API
- `WHATSAPP_API_URL` - رابط WhatsApp Business API
- `WHATSAPP_API_TOKEN` - رمز الوصول لـ WhatsApp
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - إعدادات البريد الإلكتروني

---

## الخطوة 8: البناء والاختبار

### 8.1 تثبيت الحزم

```bash
cd /home/ubuntu/sgh-crm-portal
pnpm install
```

### 8.2 بناء المشروع

```bash
pnpm build
```

### 8.3 اختبار المشروع

استخدم `webdev_check_status` للتحقق من حالة المشروع.

### 8.4 حفظ Checkpoint

```bash
استخدم webdev_save_checkpoint مع وصف شامل للتغييرات
```

---

## الخطوة 9: النشر

بعد حفظ checkpoint بنجاح:

1. افتح واجهة Manus Management UI
2. انتقل إلى Dashboard
3. اضغط على زر "Publish"
4. سيتم نشر الموقع على نطاق Manus

---

## الملفات الرئيسية المطلوبة

### Server Files (8 ملفات):
1. `drizzle/schema.ts` - تعريف قاعدة البيانات
2. `server/routers/offers.ts` - إدارة العروض
3. `server/routers/camps.ts` - إدارة المخيمات
4. `server/routers.ts` - تجميع الـ routers
5. `server/db.ts` - دوال قاعدة البيانات
6. `server/facebookConversion.ts` - تكامل Meta
7. `server/whatsapp.ts` - تكامل WhatsApp
8. `server/email.ts` - خدمة البريد

### Client Files (11 صفحة):
1. `app/page.tsx` - الصفحة الرئيسية
2. `app/offers/page.tsx` - قائمة العروض
3. `app/offers/[slug]/page.tsx` - صفحة هبوط العرض
4. `app/doctors/page.tsx` - قائمة الأطباء
5. `app/doctors/[slug]/page.tsx` - صفحة هبوط الطبيب
6. `app/camps/page.tsx` - قائمة المخيمات
7. `app/camps/[slug]/page.tsx` - صفحة هبوط المخيم
8. `app/admin/page.tsx` - لوحة التحكم
9. `app/admin/leads/page.tsx` - إدارة العملاء
10. `app/admin/offers/page.tsx` - إدارة العروض
11. `app/admin/doctors/page.tsx` - إدارة الأطباء
12. `app/admin/camps/page.tsx` - إدارة المخيمات

### Utilities (3 ملفات):
1. `shared/_core/utils/slug.ts` - توليد slugs
2. `public/assets/*` - الصور والأصول

---

## إحصائيات المشروع

- **إجمالي الملفات:** ~30 ملف
- **إجمالي الأكواد:** ~3500 سطر
- **الجداول:** 10 جداول
- **الصفحات العامة:** 7 صفحات
- **صفحات الإدارة:** 5 صفحات
- **API Endpoints:** ~40 endpoint

---

## الميزات الرئيسية

✅ نظام CRM متكامل  
✅ إدارة حملات تسويقية (عروض، أطباء، مخيمات)  
✅ صفحات هبوط ديناميكية  
✅ نماذج تسجيل مع التحقق  
✅ لوحة تحكم إدارية شاملة  
✅ تكامل Meta Pixel & Conversion API  
✅ تكامل WhatsApp Business API  
✅ نظام إشعارات البريد الإلكتروني  
✅ تتبع UTM Parameters  
✅ نظام صلاحيات المستخدمين  

---

## ملاحظات مهمة

1. **استيراد db:** تأكد من استخدام `getDb()` بدلاً من `db` المباشر في جميع الـ routers
2. **Slugs:** يتم توليد slugs تلقائياً من الأسماء العربية
3. **OAuth:** يتطلب تكوين OAUTH_SERVER_URL في بيئة Manus
4. **Database:** استخدم MySQL 8.0 أو أحدث
5. **Node.js:** يتطلب Node.js 22 أو أحدث

---

## الدعم والمساعدة

- **المطور:** وهي
- **الفريق:** آيديا للإستشارات والحلول التسويقية والتقنية
- **المدير العام:** عبدالقوي
- **GitHub:** https://github.com/abood22828/sgh-crm-portal

---

## الخلاصة

باتباع هذا الدليل خطوة بخطوة، ستتمكن من نقل المشروع بالكامل إلى منصة Manus Web Development والاستفادة من جميع ميزات الإدارة الرسومية.

**الوقت المتوقع للنقل:** 30-45 دقيقة  
**مستوى الصعوبة:** متوسط  
**النتيجة:** مشروع Manus كامل قابل للنشر والإدارة
