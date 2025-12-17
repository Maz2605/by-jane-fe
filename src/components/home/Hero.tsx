"use client";

import React, { useState, useRef, useEffect } from "react";

// 1. Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// 2. Import CSS Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// 3. Import Icons
import { Headset, PackageCheck, Truck, HandCoins, Volume2, VolumeX } from "lucide-react";

// --- TYPES (Quan trọng: Phải export để Service dùng chung) ---
export interface HeroSlide {
  id: number;
  type: "image" | "video";
  url: string;      // URL này sẽ là đường dẫn đầy đủ (http://localhost:1337/...)
  poster?: string;
  alt?: string;
}

interface HeroProps {
  slides?: HeroSlide[];
}

// --- MOCK DATA (Dữ liệu mẫu - Fallback khi chưa có API hoặc API lỗi) ---
const MOCK_SLIDES: HeroSlide[] = [
  {
    id: 1,
    type: "image",
    url: "/images/banners/banner.png",
    alt: "Siêu Sale Tháng 12",
  },
  {
    id: 2,
    type: "video",
    url: "/images/banners/BackToSchool.mov",
    poster: "/images/banners/banner-full-1.png",
    alt: "Video giới thiệu",
  },
  {
    id: 3,
    type: "image",
    url: "/images/banners/banner-full.png",
    alt: "Thời trang nam nữ",
  },
];

// --- COMPONENT CON: VIDEO SLIDE ITEM ---
interface VideoSlideProps {
  slide: HeroSlide;
  isActive: boolean;
  onToggleSound: (isMuted: boolean) => void;
  onVideoEnded: () => void;
}

const VideoSlideItem = ({ slide, isActive, onToggleSound, onVideoEnded }: VideoSlideProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // LOGIC: Quản lý Play/Pause/Reset khi slide ẩn/hiện
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // 1. Slide hiện ra -> Ép chạy video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay prevented:", error);
          // Fallback an toàn: Mute và chạy tiếp
          video.muted = true;
          video.play();
        });
      }
    } else {
      // 2. Slide ẩn đi -> Pause và Reset trạng thái
      video.pause();
      video.currentTime = 0; // Tua về đầu
      
      // Reset về Mute để lần sau quay lại không bị ồn
      setIsMuted(true);
      if (video.muted === false) {
        video.muted = true;
        onToggleSound(true); // Báo cha reset autoplay slider
      }
    }
  }, [isActive, onToggleSound]);

  const toggleSound = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // Báo lên cha để dừng/chạy Slider
      onToggleSound(newMutedState);
    }
  };

  return (
    <div className="relative w-full h-full group/video">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={slide.url}
        poster={slide.poster}
        // Lưu ý: Không dùng autoPlay ở đây vì đã control bằng useEffect
        muted={isMuted}
        // Nếu Muted -> Loop. Nếu có tiếng -> Chạy 1 lần rồi trigger onEnded
        loop={isMuted} 
        playsInline
        onEnded={() => {
          if (!isMuted) onVideoEnded();
        }}
      />
      
      {/* Nút Volume */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        className="absolute top-6 right-6 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm cursor-pointer shadow-lg border border-white/20"
        title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

// --- COMPONENT CHÍNH: HERO ---
export default function Hero({ slides = MOCK_SLIDES }: HeroProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Xử lý khi bật/tắt tiếng -> Dừng/Chạy Slider
  const handleSoundChange = (isMuted: boolean) => {
    if (!swiperInstance) return;
    if (isMuted) {
      swiperInstance.autoplay.start();
    } else {
      swiperInstance.autoplay.stop();
    }
  };

  // Xử lý khi Video chạy hết -> Qua slide tiếp
  const handleVideoEnded = () => {
    if (!swiperInstance) return;
    swiperInstance.slideNext();
    swiperInstance.autoplay.start();
  };

  return (
    <section className="bg-gray-50 pb-12">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* Wrapper Slider */}
        <div className="w-full relative rounded-2xl overflow-hidden shadow-sm bg-gray-200 group">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            onSwiper={setSwiperInstance}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            speed={1200} // Tốc độ lướt mượt mà (1.2s)
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }} // Thêm dynamicBullets cho đẹp
            navigation={true}
            className="w-full aspect-4/3 md:aspect-16/8"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="relative w-full h-full">
                {/* Render Prop để lấy trạng thái isActive */}
                {({ isActive }) => (
                  <div className="relative w-full h-full bg-gray-100">
                    {slide.type === "video" ? (
                      <VideoSlideItem 
                        slide={slide}
                        isActive={isActive}
                        onToggleSound={handleSoundChange}
                        onVideoEnded={handleVideoEnded}
                      />
                    ) : (
                      <img
                        src={slide.url}
                        alt={slide.alt}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager" // Load ngay lập tức (LCP optimization)
                      />
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl -mt-16 md:-mt-12 py-6 px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <TrustBar />
        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENTS (Giữ nguyên) ---
function TrustBar() {
  return (
    <>
      <TrustItem icon={<Headset size={24} strokeWidth={2} />} title="Giao hàng toàn quốc" sub="Thanh toán (COD) khi nhận hàng" />
      <TrustItem icon={<PackageCheck size={24} strokeWidth={2} />} title="Miễn phí giao hàng" sub="Theo chính sách" />
      <TrustItem icon={<Truck size={24} strokeWidth={2} />} title="Đổi trả trong 7 ngày" sub="Kể từ ngày mua hàng" />
      <TrustItem icon={<HandCoins size={24} strokeWidth={2} />} title="Hỗ trợ 24/7" sub="Theo chính sách" />
    </>
  );
}

function TrustItem({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 md:justify-center md:border-r border-gray-100 last:border-0">
      <div className="bg-[#FF8A65] p-2.5 rounded-xl text-white shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}