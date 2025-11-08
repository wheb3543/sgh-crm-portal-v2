/**
 * Home Page - Main landing page for the hospital
 * الصفحة الرئيسية - صفحة الهبوط الرئيسية للمستشفى
 *
 * This page will serve as the main entry point, providing an overview of the hospital,
 * its services, and key sections like offers, doctors, and medical camps.
 * This component will be rendered as a Server Component by default.
 *
 * @returns {JSX.Element}
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900">المستشفى السعودي الألماني - صنعاء</h1>
        <p className="mt-4 text-lg text-gray-700">بعون الله نرعاكم كأهالينا</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Offers Section */}
        <Link href="/offers" passHref>
          <Button className="w-full h-24 text-xl" variant="outline">العروض</Button>
        </Link>

        {/* Doctors Section */}
        <Link href="/doctors" passHref>
          <Button className="w-full h-24 text-xl" variant="outline">الأطباء</Button>
        </Link>

        {/* Medical Camps Section */}
        <Link href="/camps" passHref>
          <Button className="w-full h-24 text-xl" variant="outline">المخيمات الطبية</Button>
        </Link>
      </div>

      <div className="mt-16 text-center max-w-3xl">
        <h2 className="text-3xl font-semibold text-blue-800">خدماتنا وأقسامنا</h2>
        <p className="mt-4 text-gray-600">
          نقدم مجموعة واسعة من الخدمات الطبية عالية الجودة عبر أقسامنا المتخصصة، بما في ذلك قسم أمراض وجراحة النساء والتوليد، قسم الجراحة العامة، قسم الأطفال، قسم العظام، وغيرها الكثير. نلتزم بتقديم أفضل رعاية صحية لمرضانا باستخدام أحدث التقنيات وأفضل الكوادر الطبية.
        </p>
      </div>
    </main>
  );
}
