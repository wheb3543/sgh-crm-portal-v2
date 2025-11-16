# قائمة الملفات المطلوبة للنقل إلى Manus

**المشروع:** بوابة CRM - المستشفى السعودي الألماني  
**التاريخ:** 9 نوفمبر 2025  
**الإجمالي:** 45 ملف رئيسي

---

## 📋 قائمة الملفات الكاملة

### 1️⃣ ملفات قاعدة البيانات (1 ملف)

```
✅ drizzle/schema.ts
   - حجم: ~15 KB
   - الوصف: تعريف جميع جداول قاعدة البيانات
   - الأهمية: حرج
```

---

### 2️⃣ ملفات Server Routers (3 ملفات)

```
✅ server/routers.ts
   - حجم: ~35 KB
   - الوصف: ملف الـ routers الرئيسي
   - الأهمية: حرج

✅ server/routers/offers.ts
   - حجم: ~12 KB
   - الوصف: router إدارة العروض
   - الأهمية: حرج

✅ server/routers/camps.ts
   - حجم: ~10 KB
   - الوصف: router إدارة المخيمات (جديد)
   - الأهمية: حرج
```

---

### 3️⃣ الصفحات العامة (7 ملفات)

#### صفحات العروض:
```
✅ app/offers/page.tsx
   - حجم: ~8 KB
   - الوصف: قائمة العروض
   - الأهمية: عالية

✅ app/offers/[slug]/page.tsx
   - حجم: ~12 KB
   - الوصف: صفحة هبوط العرض
   - الأهمية: عالية
```

#### صفحات الأطباء:
```
✅ app/doctors/page.tsx
   - حجم: ~8 KB
   - الوصف: قائمة الأطباء
   - الأهمية: عالية

✅ app/doctors/[slug]/page.tsx
   - حجم: ~10 KB
   - الوصف: صفحة هبوط الطبيب
   - الأهمية: عالية
```

#### صفحات المخيمات (جديد):
```
✅ app/camps/page.tsx
   - حجم: ~9 KB
   - الوصف: قائمة المخيمات
   - الأهمية: عالية

✅ app/camps/[slug]/page.tsx
   - حجم: ~11 KB
   - الوصف: صفحة هبوط المخيم
   - الأهمية: عالية
```

---

### 4️⃣ صفحات الإدارة (5 ملفات)

```
✅ app/admin/page.tsx
   - حجم: ~15 KB
   - الوصف: لوحة التحكم الرئيسية
   - الأهمية: حرج

✅ app/admin/leads/page.tsx
   - حجم: ~18 KB
   - الوصف: إدارة العملاء
   - الأهمية: عالية

✅ app/admin/offers/page.tsx
   - حجم: ~16 KB
   - الوصف: إدارة العروض
   - الأهمية: عالية

✅ app/admin/doctors/page.tsx
   - حجم: ~14 KB
   - الوصف: إدارة الأطباء
   - الأهمية: عالية

✅ app/admin/camps/page.tsx
   - حجم: ~15 KB
   - الوصف: إدارة المخيمات (جديد)
   - الأهمية: عالية
```

---

### 5️⃣ ملفات Utilities المشتركة (1 ملف)

```
✅ shared/_core/utils/slug.ts
   - حجم: ~3 KB
   - الوصف: دوال معالجة الـ slugs
   - الأهمية: متوسطة
```

---

### 6️⃣ الأصول والصور (متعدد)

```
✅ public/assets/*
   - الوصف: جميع الصور والأصول
   - الأهمية: متوسطة
   - ملاحظة: اختياري إذا لم تكن موجودة
```

---

## 📊 ملخص الملفات

| النوع | العدد | الحجم الإجمالي |
|------|------|--------------|
| ملفات قاعدة البيانات | 1 | ~15 KB |
| ملفات Server | 3 | ~57 KB |
| صفحات عامة | 7 | ~58 KB |
| صفحات إدارة | 5 | ~78 KB |
| Utilities | 1 | ~3 KB |
| أصول | متعدد | متغير |
| **الإجمالي** | **17** | **~211 KB** |

---

## 🔄 ترتيب النقل الموصى به

### المرحلة 1: الأساسيات (حرج)
1. `drizzle/schema.ts` - قاعدة البيانات
2. `server/routers.ts` - الـ routers الرئيسي
3. `server/routers/offers.ts` - router العروض
4. `server/routers/camps.ts` - router المخيمات

### المرحلة 2: الصفحات العامة
5. `app/offers/page.tsx`
6. `app/offers/[slug]/page.tsx`
7. `app/doctors/page.tsx`
8. `app/doctors/[slug]/page.tsx`
9. `app/camps/page.tsx`
10. `app/camps/[slug]/page.tsx`

### المرحلة 3: الإدارة
11. `app/admin/page.tsx`
12. `app/admin/leads/page.tsx`
13. `app/admin/offers/page.tsx`
14. `app/admin/doctors/page.tsx`
15. `app/admin/camps/page.tsx`

### المرحلة 4: الأصول والـ Utilities
16. `shared/_core/utils/slug.ts`
17. `public/assets/*`

---

## ✅ قائمة التحقق

### قبل النقل:
- [ ] تم عمل backup للمشروع الأصلي
- [ ] تم التحقق من وجود جميع الملفات
- [ ] تم التحقق من حجم الملفات

### أثناء النقل:
- [ ] تم نسخ جميع ملفات قاعدة البيانات
- [ ] تم نسخ جميع ملفات Server
- [ ] تم نسخ جميع الصفحات العامة
- [ ] تم نسخ جميع صفحات الإدارة
- [ ] تم نسخ جميع الـ Utilities

### بعد النقل:
- [ ] تم التحقق من وجود جميع الملفات
- [ ] تم التحقق من عدم وجود أخطاء
- [ ] تم تطبيق migrations
- [ ] تم البناء بنجاح

---

## 🔍 كيفية التحقق من الملفات

### التحقق من وجود الملفات:
```bash
# التحقق من ملفات قاعدة البيانات
ls -la /home/ubuntu/sgh-crm-manus/drizzle/schema.ts

# التحقق من ملفات Server
ls -la /home/ubuntu/sgh-crm-manus/server/routers/

# التحقق من الصفحات
ls -la /home/ubuntu/sgh-crm-manus/app/offers/
ls -la /home/ubuntu/sgh-crm-manus/app/doctors/
ls -la /home/ubuntu/sgh-crm-manus/app/camps/
ls -la /home/ubuntu/sgh-crm-manus/app/admin/
```

### التحقق من سلامة الملفات:
```bash
# فحص TypeScript
pnpm check

# فحص البناء
pnpm build

# فحص الأخطاء
pnpm lint
```

---

## 📝 ملاحظات مهمة

### 1. ترتيب النقل
- **يجب** نقل ملفات قاعدة البيانات أولاً
- ثم نقل ملفات Server
- ثم نقل الصفحات

### 2. الملفات المشروطة
- ملفات الأصول اختيارية إذا لم تكن موجودة
- يمكن إضافة صور جديدة لاحقاً

### 3. المتطلبات
- Node.js 18+
- pnpm 8+
- MySQL 5.7+

### 4. الدعم
- في حالة وجود مشاكل، راجع `MANUS_DEPLOYMENT_STEP_BY_STEP.md`
- للمساعدة التقنية، تواصل مع فريق آيديا

---

## 🎯 الملفات الحرجة

هذه الملفات **يجب** أن تُنقل بنجاح:

```
🔴 drizzle/schema.ts
🔴 server/routers.ts
🔴 server/routers/offers.ts
🔴 server/routers/camps.ts
🔴 app/admin/page.tsx
```

بدون هذه الملفات، المشروع **لن يعمل**.

---

**تم إعداد هذه القائمة في:** 9 نوفمبر 2025  
**الحالة:** ✅ جاهز للاستخدام  
**الإصدار:** 2.0.0
