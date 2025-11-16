#!/bin/bash

#############################################################################
# Manus Migration Script - سكريبت نقل المشروع إلى Manus
#
# هذا السكريبت ينقل جميع ملفات المشروع من GitHub إلى مشروع Manus جديد
# تم إعداده بواسطة: وهي (فريق آيديا)
# التاريخ: 9 نوفمبر 2025
#############################################################################

set -e

# الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# الدوال المساعدة
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

#############################################################################
# الخطوة 1: التحقق من المتطلبات
#############################################################################
print_header "الخطوة 1: التحقق من المتطلبات"

if ! command -v git &> /dev/null; then
    print_error "Git غير مثبت"
    exit 1
fi
print_success "Git مثبت"

if ! command -v node &> /dev/null; then
    print_error "Node.js غير مثبت"
    exit 1
fi
print_success "Node.js مثبت: $(node --version)"

if ! command -v pnpm &> /dev/null; then
    print_error "pnpm غير مثبت"
    exit 1
fi
print_success "pnpm مثبت: $(pnpm --version)"

#############################################################################
# الخطوة 2: إعداد المتغيرات
#############################################################################
print_header "الخطوة 2: إعداد المتغيرات"

SOURCE_DIR="/home/ubuntu/sgh-crm-portal-backup"
WORK_DIR=$(pwd)
PROJECT_NAME="sgh-crm-manus"

print_step "مجلد المصدر: $SOURCE_DIR"
print_step "مجلد العمل: $WORK_DIR"
print_step "اسم المشروع: $PROJECT_NAME"

#############################################################################
# الخطوة 3: نسخ schema قاعدة البيانات
#############################################################################
print_header "الخطوة 3: نسخ schema قاعدة البيانات"

print_step "نسخ drizzle/schema.ts..."
cp "$SOURCE_DIR/drizzle/schema.ts" "$WORK_DIR/drizzle/schema.ts"
print_success "تم نسخ schema بنجاح"

#############################################################################
# الخطوة 4: نسخ Server Routers
#############################################################################
print_header "الخطوة 4: نسخ Server Routers"

print_step "نسخ server/routers/offers.ts..."
cp "$SOURCE_DIR/server/routers/offers.ts" "$WORK_DIR/server/routers/offers.ts"
print_success "تم نسخ offers router"

print_step "نسخ server/routers/camps.ts..."
cp "$SOURCE_DIR/server/routers/camps.ts" "$WORK_DIR/server/routers/camps.ts"
print_success "تم نسخ camps router"

print_step "نسخ server/routers.ts..."
cp "$SOURCE_DIR/server/routers.ts" "$WORK_DIR/server/routers.ts"
print_success "تم نسخ routers.ts"

#############################################################################
# الخطوة 5: نسخ الصفحات العامة
#############################################################################
print_header "الخطوة 5: نسخ الصفحات العامة"

print_step "نسخ صفحات العروض..."
cp "$SOURCE_DIR/app/offers/page.tsx" "$WORK_DIR/app/offers/page.tsx"
cp "$SOURCE_DIR/app/offers/\[slug\]/page.tsx" "$WORK_DIR/app/offers/[slug]/page.tsx"
print_success "تم نسخ صفحات العروض"

print_step "نسخ صفحات الأطباء..."
cp "$SOURCE_DIR/app/doctors/page.tsx" "$WORK_DIR/app/doctors/page.tsx"
cp "$SOURCE_DIR/app/doctors/\[slug\]/page.tsx" "$WORK_DIR/app/doctors/[slug]/page.tsx"
print_success "تم نسخ صفحات الأطباء"

print_step "نسخ صفحات المخيمات..."
mkdir -p "$WORK_DIR/app/camps/[slug]"
cp "$SOURCE_DIR/app/camps/page.tsx" "$WORK_DIR/app/camps/page.tsx"
cp "$SOURCE_DIR/app/camps/\[slug\]/page.tsx" "$WORK_DIR/app/camps/[slug]/page.tsx"
print_success "تم نسخ صفحات المخيمات"

#############################################################################
# الخطوة 6: نسخ لوحة التحكم الإدارية
#############################################################################
print_header "الخطوة 6: نسخ لوحة التحكم الإدارية"

print_step "نسخ صفحات الإدارة..."
mkdir -p "$WORK_DIR/app/admin/leads"
mkdir -p "$WORK_DIR/app/admin/offers"
mkdir -p "$WORK_DIR/app/admin/doctors"
mkdir -p "$WORK_DIR/app/admin/camps"

cp "$SOURCE_DIR/app/admin/page.tsx" "$WORK_DIR/app/admin/page.tsx"
cp "$SOURCE_DIR/app/admin/leads/page.tsx" "$WORK_DIR/app/admin/leads/page.tsx"
cp "$SOURCE_DIR/app/admin/offers/page.tsx" "$WORK_DIR/app/admin/offers/page.tsx"
cp "$SOURCE_DIR/app/admin/doctors/page.tsx" "$WORK_DIR/app/admin/doctors/page.tsx"
cp "$SOURCE_DIR/app/admin/camps/page.tsx" "$WORK_DIR/app/admin/camps/page.tsx"
print_success "تم نسخ صفحات الإدارة"

#############################################################################
# الخطوة 7: نسخ المكونات والأصول
#############################################################################
print_header "الخطوة 7: نسخ المكونات والأصول"

print_step "نسخ shared utilities..."
cp "$SOURCE_DIR/shared/_core/utils/slug.ts" "$WORK_DIR/shared/_core/utils/slug.ts"
print_success "تم نسخ utilities"

print_step "نسخ الصور والأصول..."
mkdir -p "$WORK_DIR/public/assets"
if [ -d "$SOURCE_DIR/public/assets" ]; then
    cp -r "$SOURCE_DIR/public/assets/"* "$WORK_DIR/public/assets/" 2>/dev/null || true
    print_success "تم نسخ الأصول"
else
    print_warning "لم يتم العثور على مجلد الأصول"
fi

#############################################################################
# الخطوة 8: تثبيت الحزم
#############################################################################
print_header "الخطوة 8: تثبيت الحزم"

print_step "تثبيت الحزم..."
pnpm install
print_success "تم تثبيت الحزم"

#############################################################################
# الخطوة 9: تطبيق Database Migrations
#############################################################################
print_header "الخطوة 9: تطبيق Database Migrations"

print_step "تطبيق migrations..."
pnpm db:push
print_success "تم تطبيق migrations"

#############################################################################
# الخطوة 10: البناء
#############################################################################
print_header "الخطوة 10: البناء"

print_step "بناء المشروع..."
pnpm build
print_success "تم بناء المشروع بنجاح"

#############################################################################
# الملخص النهائي
#############################################################################
print_header "الملخص النهائي"

print_success "تم نقل المشروع بنجاح! ✅"
echo ""
echo -e "${GREEN}الخطوات التالية:${NC}"
echo "1. أضف متغيرات البيئة المطلوبة في Settings → Secrets"
echo "2. اختبر المشروع محلياً: pnpm dev"
echo "3. احفظ checkpoint: webdev_save_checkpoint"
echo "4. انقر على زر Publish في واجهة Manus"
echo ""
print_success "المشروع جاهز للنشر! 🚀"
