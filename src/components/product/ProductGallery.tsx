"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, PlayCircle } from "lucide-react";

interface MediaItem {
  id: number;
  url: string;
  type: "image" | "video";
  mime: string;
}

export default function ProductGallery({ items }: { items: MediaItem[] }) {
  
  // Fallback data
  const mediaList = items && items.length > 0 
    ? items 
    : [{ id: 0, url: "/images/placeholder.png", type: "image", mime: "image/png" } as MediaItem];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  
  const viewportRef = useRef<HTMLDivElement>(null);
  // 1. Tạo Ref để lưu trữ danh sách các video element
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentItem = mediaList[currentIndex];
  const isVideo = currentItem.type === "video";

  // --- LOGIC XỬ LÝ AUTOPLAY KHI SLIDE THAY ĐỔI ---
  useEffect(() => {
    // Reset Zoom mỗi khi đổi slide
    resetZoom();

    // Duyệt qua tất cả video refs để xử lý Play/Pause
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === currentIndex) {
        // Nếu là slide hiện tại: Reset về đầu và chạy
        video.currentTime = 0;
        const playPromise = video.play();
        
        // Xử lý lỗi play() bị chặn bởi browser (nếu chưa user interaction)
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Autoplay prevented:", error);
            });
        }
      } else {
        // Nếu không phải slide hiện tại: Pause ngay lập tức
        video.pause();
      }
    });
  }, [currentIndex]); // Chạy lại logic này mỗi khi index thay đổi

  // --- LOGIC CHUYỂN SLIDE ---
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setTransformOrigin("center center");
  };

  // --- LOGIC ZOOM ---
  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isVideo) return; // Không zoom video
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomLevel((prev) => Math.min(Math.max(prev + delta, 1), 4));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isVideo]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isVideo && zoomLevel > 1 && viewportRef.current) {
      const { left, top, width, height } = viewportRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-fit select-none">
      
      {/* 1. THUMBNAILS */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide md:max-h-[500px] w-full md:w-20 shrink-0">
        {mediaList.map((item, idx) => (
          <div 
            key={idx} 
            onMouseEnter={() => setCurrentIndex(idx)}
            className={`
              relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all border-2 group/thumb
              ${currentIndex === idx 
                ? "border-[#FF5E4D] ring-1 ring-[#FF5E4D]" 
                : "border-transparent hover:border-gray-300 bg-gray-50"
              }
            `}
          >
            {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <video src={item.url} className="w-full h-full object-cover opacity-80" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-transparent transition-all">
                        <PlayCircle size={24} className="text-white drop-shadow-md" />
                    </div>
                </div>
            ) : (
                <img src={item.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>

      {/* 2. MAIN VIEWPORT */}
      <div 
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        className="flex-1 bg-gray-50 rounded-2xl overflow-hidden relative group h-[400px] md:h-[530px] border border-gray-100"
      >
        
        {/* SLIDER TRACK */}
        <div 
            className="flex h-full transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {mediaList.map((item, idx) => (
                <div key={idx} className="w-full h-full shrink-0 flex items-center justify-center relative overflow-hidden bg-white">
                    {item.type === 'video' ? (
                        // --- RENDER VIDEO VỚI REF ---
                        <video 
                            // Gán ref vào array để quản lý
                            ref={(el) => { videoRefs.current[idx] = el; }}
                            src={item.url} 
                            controls={true} // Vẫn nên để control cho user tự điều chỉnh
                            muted={true}    // Bắt buộc muted để autoplay được trên Chrome/Safari
                            playsInline     // Bắt buộc cho iOS để không full màn hình
                            loop            // Tùy chọn: lặp lại video
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <img 
                            src={item.url} 
                            alt={`Product ${idx}`} 
                            style={{ 
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: transformOrigin, 
                                cursor: zoomLevel > 1 ? "grab" : "zoom-in"
                            }}
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-100 ease-out" 
                        />
                    )}
                </div>
            ))}
        </div>

        {/* --- CONTROLS UI GIỮ NGUYÊN --- */}
        {!isVideo && (
            <>
                {zoomLevel > 1 && (
                    <button onClick={resetZoom} className="absolute top-4 right-4 bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors z-20">
                        <RotateCcw size={20} />
                    </button>
                )}
                <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                    <button onClick={() => setZoomLevel(p => Math.min(p + 0.5, 4))} className="bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors">
                        <ZoomIn size={20} />
                    </button>
                    <button onClick={() => setZoomLevel(p => Math.max(p - 0.5, 1))} className="bg-white/90 text-gray-700 p-2 rounded-full shadow-sm hover:bg-[#FF5E4D] hover:text-white transition-colors">
                        <ZoomOut size={20} />
                    </button>
                </div>
            </>
        )}

        {mediaList.length > 1 && zoomLevel === 1 && (
            <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF5E4D] hover:text-white z-10">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF5E4D] hover:text-white z-10">
                    <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-20">
                    {currentIndex + 1} / {mediaList.length}
                </div>
            </>
        )}
      </div>
    </div>
  );
}