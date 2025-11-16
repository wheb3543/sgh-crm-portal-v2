# دليل النشر الشامل على Manus - خطوة بخطوة

**المشروع:** بوابة CRM - المستشفى السعودي الألماني  
**التاريخ:** 9 نوفمبر 2025  
**المطور:** وهي (فريق آيديا)  
**المدير العام:** عبدالقوي

---

## 📋 المقدمة

هذا الدليل يشرح كيفية نشر مشروع **بوابة CRM** على منصة **Manus Web Development** بشكل كامل وآمن.

**الوقت المتوقع:** 30-45 دقيقة  
**مستوى الصعوبة:** متوسط  
**المتطلبات:** جلسة Manus جديدة لم يتم فيها إنشاء مشروع من قبل

---

## 🚀 الخطوات الرئيسية

### المرحلة 1: الإعداد الأولي

#### الخطوة 1.1: فتح جلسة Manus جديدة
1. اذهب إلى https://manus.im
2. افتح جلسة جديدة (تأكد أنها جلسة جديدة لم يتم فيها إنشاء مشروع)
3. استعد لإنشاء المشروع

#### الخطوة 1.2: إنشاء مشروع Manus جديد
في جلسة Manus الجديدة، استخدم الأداة `webdev_init_project` مع المعاملات التالية:

```
project_name: sgh-crm-manus
project_title: بوابة CRM - المستشفى السعودي الألماني
features: web-db-user
description: نظام إلكتروني متكامل لإدارة حملات التسويق وعلاقات العملاء
```

**النتيجة المتوقعة:**
```
✅ Project created successfully at /home/ubuntu/sgh-crm-manus
✅ Features: web, db, user
✅ Ready for migration
```

---

### المرحلة 2: نقل الملفات

#### الخطوة 2.1: نسخ Schema قاعدة البيانات

**الملف المصدر:** `/home/ubuntu/sgh-crm-portal-backup/drizzle/schema.ts`  
**الملف الهدف:** `/home/ubuntu/sgh-crm-manus/drizzle/schema.ts`

```bash
cp /home/ubuntu/sgh-crm-portal-backup/drizzle/schema.ts \
   /home/ubuntu/sgh-crm-manus/drizzle/schema.ts
```

**التحقق:**
```bash
ls -la /home/ubuntu/sgh-crm-manus/drizzle/schema.ts
```

#### الخطوة 2.2: نسخ Server Routers

**الملفات المطلوبة:**
```bash
# نسخ offers router
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/offers.ts \
   /home/ubuntu/sgh-crm-manus/server/routers/offers.ts

# نسخ camps router
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/camps.ts \
   /home/ubuntu/sgh-crm-manus/server/routers/camps.ts

# نسخ routers.ts الرئيسي
cp /home/ubuntu/sgh-crm-portal-backup/server/routers.ts \
   /home/ubuntu/sgh-crm-manus/server/routers.ts
```

**التحقق:**
```bash
ls -la /home/ubuntu/sgh-crm-manus/server/routers/
```

#### الخطوة 2.3: نسخ الصفحات العامة

**صفحات العروض:**
```bash
cp /home/ubuntu/sgh-crm-portal-backup/app/offers/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/offers/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/offers/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/offers/[slug]/page.tsx
```

**صفحات الأطباء:**
```bash
cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/doctors/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/doctors/[slug]/page.tsx
```

**صفحات المخيمات (جديد):**
```bash
mkdir -p /home/ubuntu/sgh-crm-manus/app/camps/[slug]

cp /home/ubuntu/sgh-crm-portal-backup/app/camps/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/camps/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/camps/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/camps/[slug]/page.tsx
```

#### الخطوة 2.4: نسخ لوحة التحكم الإدارية

```bash
# إنشاء المجلدات
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/leads
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/offers
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/doctors
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/camps

# نسخ الملفات
cp /home/ubuntu/sgh-crm-portal-backup/app/admin/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/admin/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/admin/leads/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/admin/leads/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/admin/offers/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/admin/offers/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/admin/doctors/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/admin/doctors/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/admin/camps/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/admin/camps/page.tsx
```

#### الخطوة 2.5: نسخ المكونات والأصول

```bash
# نسخ utilities
cp /home/ubuntu/sgh-crm-portal-backup/shared/_core/utils/slug.ts \
   /home/ubuntu/sgh-crm-manus/shared/_core/utils/slug.ts

# نسخ الأصول (الصور)
mkdir -p /home/ubuntu/sgh-crm-manus/public/assets
cp -r /home/ubuntu/sgh-crm-portal-backup/public/assets/* \
      /home/ubuntu/sgh-crm-manus/public/assets/ 2>/dev/null || true
```

---

### المرحلة 3: التكوين والبناء

#### الخطوة 3.1: تثبيت الحزم

```bash
cd /home/ubuntu/sgh-crm-manus
pnpm install
```

**النتيجة المتوقعة:**
```
✅ All dependencies installed
✅ node_modules created
✅ pnpm-lock.yaml updated
```

#### الخطوة 3.2: تطبيق Database Migrations

```bash
pnpm db:push
```

**النتيجة المتوقعة:**
```
✅ Migrations applied successfully
✅ 10 tables created
✅ Database ready
```

#### الخطوة 3.3: البناء

```bash
pnpm build
```

**النتيجة المتوقعة:**
```
✅ Build successful
✅ No errors
✅ Ready for deployment
```

---

### المرحلة 4: التكوين والاختبار

#### الخطوة 4.1: فحص المشروع

```bash
pnpm check
```

**النتيجة المتوقعة:**
```
✅ TypeScript check passed
✅ No errors found
```

#### الخطوة 4.2: اختبار محلي (اختياري)

```bash
pnpm dev
```

سيفتح الموقع على `http://localhost:3000`

#### الخطوة 4.3: التحقق من الحالة

استخدم `webdev_check_status` للتحقق من حالة المشروع:

```
✅ Server running
✅ Database connected
✅ All endpoints available
```

---

### المرحلة 5: متغيرات البيئة

#### الخطوة 5.1: إضافة المتغيرات الإلزامية

استخدم `webdev_request_secrets` لإضافة المتغيرات التالية:

**المتغيرات الإلزامية:**
- `DATABASE_URL` - رابط قاعدة البيانات MySQL

**المتغيرات الاختيارية (للتكاملات):**
- `META_PIXEL_ID` - معرف Meta Pixel
- `META_ACCESS_TOKEN` - رمز الوصول لـ Conversion API
- `WHATSAPP_API_URL` - رابط WhatsApp Business API
- `WHATSAPP_API_TOKEN` - رمز الوصول لـ WhatsApp
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - إعدادات البريد

#### الخطوة 5.2: التحقق من المتغيرات

في Management UI:
1. اذهب إلى Settings → Secrets
2. تحقق من وجود جميع المتغيرات
3. تأكد من صحة القيم

---

### المرحلة 6: الحفظ والنشر

#### الخطوة 6.1: حفظ Checkpoint

استخدم `webdev_save_checkpoint` مع الوصف التالي:

```
feat: Complete CRM Portal Migration to Manus

✅ Database schema migrated (10 tables)
✅ All routers migrated (40+ endpoints)
✅ All pages migrated (12 pages)
✅ Admin dashboard migrated (5 pages)
✅ All assets and utilities migrated
✅ Project ready for production
```

**النتيجة المتوقعة:**
```
✅ Checkpoint saved successfully
✅ Version ID: [version_id]
✅ Ready for publishing
```

#### الخطوة 6.2: النشر

في Management UI:
1. اذهب إلى Dashboard
2. انقر على زر "Publish" (أعلى اليمين)
3. انتظر اكتمال النشر

**النتيجة المتوقعة:**
```
✅ Publishing started
✅ Build in progress
✅ Deployment in progress
✅ Live on: https://sgh-crm-manus.manus.space
```

---

## ✅ قائمة التحقق النهائية

### قبل الحفظ:
- [ ] جميع الملفات نُقلت بنجاح
- [ ] لا توجد أخطاء TypeScript
- [ ] قاعدة البيانات متصلة
- [ ] جميع الـ endpoints تعمل
- [ ] جميع الصفحات تحمل
- [ ] المشروع يبني بنجاح

### قبل النشر:
- [ ] Checkpoint محفوظ
- [ ] متغيرات البيئة مضافة
- [ ] الاختبار المحلي نجح
- [ ] webdev_check_status يظهر حالة جيدة

---

## 🔧 استكشاف الأخطاء

### مشكلة: خطأ في نسخ الملفات

**الحل:**
```bash
# تحقق من وجود المجلد المصدر
ls -la /home/ubuntu/sgh-crm-portal-backup

# تحقق من وجود المجلد الهدف
ls -la /home/ubuntu/sgh-crm-manus
```

### مشكلة: خطأ في قاعدة البيانات

**الحل:**
```bash
# تحقق من الاتصال
mysql -u root -p

# تحقق من الجداول
USE sgh_crm;
SHOW TABLES;
```

### مشكلة: خطأ في البناء

**الحل:**
```bash
# حذف node_modules والـ lock file
rm -rf node_modules pnpm-lock.yaml

# إعادة التثبيت
pnpm install

# إعادة البناء
pnpm build
```

---

## 📞 معلومات الاتصال

- **المطور:** وهي
- **الفريق:** آيديا للإستشارات والحلول التسويقية والتقنية
- **المدير العام:** عبدالقوي
- **المستودع:** https://github.com/wheb3543/sgh-crm-portal-v2

---

## 🎉 النتيجة النهائية

بعد اتباع جميع الخطوات:

✅ **المشروع منشور على Manus**  
✅ **متاح على رابط عام**  
✅ **جاهز للاستخدام الفعلي**  
✅ **قابل للإدارة من واجهة Manus**

---

**تم إعداد هذا الدليل بنجاح في:** 9 نوفمبر 2025  
**الحالة:** ✅ جاهز للاستخدام  
**الإصدار:** 2.0.0
