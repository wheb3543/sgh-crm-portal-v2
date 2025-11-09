# دليل التطوير

هذا الدليل يساعدك على إعداد بيئة التطوير المحلية للعمل على مشروع **بوابة CRM**.

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- **Node.js 22+** - [تحميل](https://nodejs.org/)
- **MySQL 8.0+** - [تحميل](https://www.mysql.com/downloads/)
- **Git** - [تحميل](https://git-scm.com/)
- **pnpm** - `npm install -g pnpm`

## 🚀 الإعداد الأولي

### 1. استنساخ المستودع

```bash
git clone https://github.com/wheb3543/sgh-crm-portal-v2.git
cd sgh-crm-portal-v2
```

### 2. تثبيت الحزم

```bash
pnpm install
```

### 3. إعداد قاعدة البيانات

#### إنشاء قاعدة البيانات

```bash
# الاتصال بـ MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE sgh_crm;
CREATE USER 'sgh_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON sgh_crm.* TO 'sgh_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### إعداد متغيرات البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env

# تحرير الملف وإضافة بيانات قاعدة البيانات
nano .env
```

أضف:
```env
DATABASE_URL=mysql://sgh_user:password@localhost:3306/sgh_crm
NODE_ENV=development
PORT=3000
```

### 4. تطبيق Migrations

```bash
pnpm db:push
```

### 5. تشغيل خادم التطوير

```bash
pnpm dev
```

سيكون الموقع متاحاً على `http://localhost:3000`

## 🛠️ الأوامر المتاحة

### التطوير

```bash
# تشغيل خادم التطوير مع Hot Reload
pnpm dev

# تشغيل Drizzle Studio (واجهة قاعدة البيانات)
pnpm db:studio
```

### البناء والإنتاج

```bash
# بناء المشروع
pnpm build

# تشغيل الخادم في الإنتاج
pnpm start
```

### الجودة والاختبار

```bash
# فحص TypeScript
pnpm check

# تنسيق الكود
pnpm format

# تشغيل الاختبارات
pnpm test
```

### قاعدة البيانات

```bash
# تطبيق migrations
pnpm db:push

# فتح واجهة Drizzle Studio
pnpm db:studio

# إنشاء migration جديد
pnpm db:generate
```

## 📁 هيكل المشروع

```
sgh-crm-portal/
├── app/                          # صفحات Next.js
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── offers/                  # صفحات العروض
│   ├── doctors/                 # صفحات الأطباء
│   ├── camps/                   # صفحات المخيمات
│   ├── admin/                   # لوحة التحكم
│   └── layout.tsx               # الـ Layout الرئيسي
├── server/                       # Backend
│   ├── _core/                   # الملفات الأساسية
│   │   ├── index.ts             # نقطة الدخول
│   │   ├── env.ts               # متغيرات البيئة
│   │   └── trpc.ts              # إعدادات tRPC
│   ├── routers/                 # tRPC routers
│   │   ├── offers.ts            # إدارة العروض
│   │   ├── camps.ts             # إدارة المخيمات
│   │   └── ...
│   ├── db.ts                    # دوال قاعدة البيانات
│   ├── email.ts                 # خدمة البريد
│   ├── whatsapp.ts              # تكامل WhatsApp
│   └── facebookConversion.ts    # تكامل Meta
├── drizzle/                      # قاعدة البيانات
│   ├── schema.ts                # تعريف الجداول
│   ├── migrations/              # ملفات الهجرة
│   └── meta/                    # بيانات وصفية
├── shared/                       # كود مشترك
│   ├── _core/                   # الملفات الأساسية
│   │   ├── types.ts             # الأنواع المشتركة
│   │   └── utils/               # دوال مساعدة
│   └── components/              # مكونات مشتركة
├── public/                       # أصول ثابتة
│   ├── assets/                  # صور وملفات
│   └── favicon.ico
├── .env.example                 # مثال على متغيرات البيئة
├── package.json                 # معلومات المشروع
├── tsconfig.json                # إعدادات TypeScript
├── vite.config.ts               # إعدادات Vite
└── drizzle.config.ts            # إعدادات Drizzle
```

## 🔧 إعداد IDE

### VS Code

#### الإضافات الموصى بها

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "svelte.svelte-vscode",
    "ms-mssql.mssql",
    "ms-azuretools.vscode-docker"
  ]
}
```

#### إعدادات Workspace

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 📝 معايير الكود

### TypeScript

- استخدم الأنواع الصريحة
- تجنب `any`
- اكتب تعليقات للدوال المعقدة

### React

- استخدم Functional Components
- استخدم Hooks
- اكتب مكونات قابلة لإعادة الاستخدام

### Styling

- استخدم Tailwind CSS
- تجنب CSS مباشر
- اتبع نظام الألوان الموجود

## 🐛 استكشاف الأخطاء

### مشكلة: خطأ في الاتصال بقاعدة البيانات

```bash
# تحقق من أن MySQL يعمل
sudo systemctl status mysql

# تحقق من بيانات الاتصال
mysql -u sgh_user -p sgh_crm

# تحقق من ملف .env
cat .env | grep DATABASE_URL
```

### مشكلة: أخطاء في TypeScript

```bash
# فحص الأخطاء
pnpm check

# إعادة تجميع
pnpm build
```

### مشكلة: مشاكل في الحزم

```bash
# حذف node_modules والـ lock file
rm -rf node_modules pnpm-lock.yaml

# إعادة التثبيت
pnpm install

# إعادة بناء
pnpm build
```

### مشكلة: المنفذ 3000 قيد الاستخدام

```bash
# البحث عن العملية
lsof -i :3000

# قتل العملية
kill -9 <PID>

# أو استخدام منفذ مختلف
PORT=3001 pnpm dev
```

## 📊 أدوات مفيدة

### Drizzle Studio

واجهة رسومية لإدارة قاعدة البيانات:

```bash
pnpm db:studio
```

يفتح على `http://localhost:5555`

### API Testing

استخدم **Postman** أو **Insomnia** لاختبار API endpoints:

```
POST http://localhost:3000/trpc/offers.create
Content-Type: application/json

{
  "title": "عرض جديد",
  "description": "وصف العرض"
}
```

### Database Monitoring

```bash
# الاتصال بـ MySQL
mysql -u sgh_user -p sgh_crm

# عرض الجداول
SHOW TABLES;

# عرض بيانات جدول
SELECT * FROM leads;

# إحصائيات
SELECT COUNT(*) FROM leads;
```

## 🚀 نصائح للتطوير السريع

### 1. استخدم Hot Reload

```bash
pnpm dev
```

يعيد تحميل الكود تلقائياً عند التغيير.

### 2. استخدم Drizzle Studio

```bash
pnpm db:studio
```

لعرض وتعديل البيانات مباشرة.

### 3. استخدم VS Code Debugger

أضف إلى `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### 4. استخدم Console Logging

```typescript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(data);
```

## 🔐 أمان التطوير

### متغيرات البيئة

- لا تضع كلمات المرور في الكود
- استخدم `.env` للبيانات الحساسة
- لا تدفع `.env` إلى GitHub

### قاعدة البيانات

- استخدم كلمات مرور قوية
- لا تستخدم `root` للتطوير
- استخدم حسابات منفصلة للإنتاج

## 📚 موارد إضافية

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [tRPC Documentation](https://trpc.io/docs)

## 🤝 الحصول على المساعدة

- افتح Issue على GitHub
- اطلب مساعدة في Discussions
- تواصل عبر البريد الإلكتروني

---

**آخر تحديث:** 9 نوفمبر 2025
