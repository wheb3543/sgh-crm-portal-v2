# النشر السريع على Manus - 5 دقائق فقط! ⚡

**المشروع:** بوابة CRM - المستشفى السعودي الألماني  
**الوقت:** 5 دقائق  
**المستوى:** سهل جداً

---

## 🚀 الخطوات السريعة

### الخطوة 1: فتح جلسة Manus جديدة
```
اذهب إلى https://manus.im وافتح جلسة جديدة
```

### الخطوة 2: إنشاء المشروع
```
استخدم webdev_init_project:
- project_name: sgh-crm-manus
- project_title: بوابة CRM - المستشفى السعودي الألماني
- features: web-db-user
```

### الخطوة 3: نسخ الملفات الحرجة
```bash
# نسخ قاعدة البيانات
cp /home/ubuntu/sgh-crm-portal-backup/drizzle/schema.ts \
   /home/ubuntu/sgh-crm-manus/drizzle/schema.ts

# نسخ الـ routers
cp /home/ubuntu/sgh-crm-portal-backup/server/routers.ts \
   /home/ubuntu/sgh-crm-manus/server/routers.ts
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/offers.ts \
   /home/ubuntu/sgh-crm-manus/server/routers/offers.ts
cp /home/ubuntu/sgh-crm-portal-backup/server/routers/camps.ts \
   /home/ubuntu/sgh-crm-manus/server/routers/camps.ts
```

### الخطوة 4: نسخ الصفحات
```bash
# الصفحات العامة
mkdir -p /home/ubuntu/sgh-crm-manus/app/offers/[slug]
mkdir -p /home/ubuntu/sgh-crm-manus/app/doctors/[slug]
mkdir -p /home/ubuntu/sgh-crm-manus/app/camps/[slug]

cp /home/ubuntu/sgh-crm-portal-backup/app/offers/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/offers/page.tsx
cp /home/ubuntu/sgh-crm-portal-backup/app/offers/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/offers/[slug]/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/doctors/page.tsx
cp /home/ubuntu/sgh-crm-portal-backup/app/doctors/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/doctors/[slug]/page.tsx

cp /home/ubuntu/sgh-crm-portal-backup/app/camps/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/camps/page.tsx
cp /home/ubuntu/sgh-crm-portal-backup/app/camps/[slug]/page.tsx \
   /home/ubuntu/sgh-crm-manus/app/camps/[slug]/page.tsx

# صفحات الإدارة
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/leads
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/offers
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/doctors
mkdir -p /home/ubuntu/sgh-crm-manus/app/admin/camps

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

### الخطوة 5: البناء والاختبار
```bash
cd /home/ubuntu/sgh-crm-manus
pnpm install
pnpm db:push
pnpm build
pnpm check
```

### الخطوة 6: الحفظ والنشر
```
1. استخدم webdev_save_checkpoint
2. انقر على زر Publish في واجهة Manus
3. انتظر اكتمال النشر
```

---

## ✅ النتيجة

```
✅ المشروع منشور على Manus
✅ متاح على: https://sgh-crm-manus.manus.space
✅ جاهز للاستخدام الفعلي
```

---

## 📚 للمزيد من التفاصيل

- 📖 **دليل شامل:** `MANUS_DEPLOYMENT_STEP_BY_STEP.md`
- 📋 **قائمة الملفات:** `FILES_TO_MIGRATE.md`
- 🤖 **سكريبت تلقائي:** `migrate-to-manus.sh`

---

**تم إعداده في:** 9 نوفمبر 2025
