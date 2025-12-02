"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { TicketPercent, Gift } from "lucide-react";


export default function ProductGallery({ images }: { images: string[] }) {
  
  // Xử lý ảnh fallback
  const imageList = images && images.length > 0 
    ? images 
    : ["/images/placeholder.png"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  
  // Ref để bắt sự kiện lăn chuột
  const viewportRef = useRef<HTMLDivElement>(null);

  // --- LOGIC CHUYỂN ẢNH ---
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
    resetZoom(); // Chuyển ảnh là phải reset zoom về 1
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setTransformOrigin("center center");
  };

  // --- LOGIC ZOOM & KHÓA CUỘN (SCROLL LOCK) ---
  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Chặn việc cuộn trang web
      e.preventDefault();

      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomLevel((prev) => Math.min(Math.max(prev + delta, 1), 4));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Tính vị trí con trỏ để zoom đúng chỗ
  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && viewportRef.current) {
      const { left, top, width, height } = viewportRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-fit select-none">
      
      {/* 1. THUMBNAILS (Giữ nguyên) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide md:max-h-[500px] w-full md:w-20 shrink-0">
        {imageList.map((img, idx) => (
          <div 
            key={idx} 
            onMouseEnter={() => {
                setCurrentIndex(idx);
                resetZoom();
            }}
            className={`
              relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all border-2 
              ${currentIndex === idx 
                ? "border-[#FF5E4D] ring-1 ring-[#FF5E4D]" 
                : "border-transparent hover:border-gray-300 bg-gray-50"
              }
            `}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 2. MAIN VIEWPORT (KHUNG NHÌN CỐ ĐỊNH) */}
      <div 
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        className="flex-1 bg-gray-50 rounded-2xl overflow-hidden relative group h-[400px] md:h-[530px] border border-gray-100"
      >
        
        {/* SLIDER TRACK (Dải ảnh chạy ngang) */}
        {/* transform: translateX -> Tạo hiệu ứng trượt */}
        <div 
            className="flex h-full transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {imageList.map((img, idx) => (
                // Mỗi ảnh chiếm 100% chiều rộng của khung cha
                <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center relative overflow-hidden">
                    <img 
                        src={img} 
                        alt={`Product ${idx}`} 
                        // Logic Zoom áp dụng trực tiếp lên ảnh
                        style={{ 
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: transformOrigin, 
                            cursor: zoomLevel > 1 ? "grab" : "zoom-in"
                        }}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-100 ease-out" 
                    />
                </div>
            ))}
        </div>

        {/* --- CÁC NÚT ĐIỀU KHIỂN (Giữ nguyên) --- */}

        {/* Nút Reset */}
        {zoomLevel > 1 && (
            <button onClick={resetZoom} className="absolute top-4 right-4 bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors z-20">
                <RotateCcw size={20} />
            </button>
        )}

        {/* Nút Zoom tay */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-20">
            <button onClick={() => setZoomLevel(p => Math.min(p + 0.5, 4))} className="bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors">
                <ZoomIn size={20} />
            </button>
            <button onClick={() => setZoomLevel(p => Math.max(p - 0.5, 1))} className="bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors">
                <ZoomOut size={20} />
            </button>
        </div>

        {/* Nav Arrows (Chỉ hiện khi chưa zoom) */}
        {imageList.length > 1 && zoomLevel === 1 && (
            <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF5E4D] hover:text-white z-10">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF5E4D] hover:text-white z-10">
                    <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-20">
                    {currentIndex + 1} / {imageList.length}
                </div>
            </>
        )}


      </div>
        
    </div>
  );
}