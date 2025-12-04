import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm max-w-lg mx-auto border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle size={48} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-500 mb-8">
                Cảm ơn bạn đã mua sắm tại ByJane. <br/>
                Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
            </p>

            <div className="flex justify-center gap-4">
                <Link href="/" className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                    Về trang chủ
                </Link>
                <Link href="/products" className="px-6 py-2.5 bg-[#FF5E4D] text-white rounded-full hover:bg-orange-600 transition-colors font-medium">
                    Tiếp tục mua sắm
                </Link>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}