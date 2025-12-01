"use client";
import { useState, useEffect } from "react";

interface CountDownTimerProps {
  targetDate: string;
}

export default function CountDownTimer({ targetDate }: CountDownTimerProps) {
  // 1. Khởi tạo state ban đầu
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 2. Thêm state để kiểm tra xem đã load xong ở Client chưa
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Khi useEffect chạy nghĩa là đã ở Client -> Set là true
    setIsClient(true);

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      let newTimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    // Tính toán ngay lập tức khi mount
    setTimeLeft(calculateTimeLeft());

    // Cập nhật mỗi giây
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // Thêm targetDate vào dependency

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

  // 3. QUAN TRỌNG: Nếu chưa phải Client thì không hiện gì cả (tránh lệch HTML)
  if (!isClient) {
    return null; 
    // Hoặc trả về một khung loading giả: <div className="text-white">Loading...</div>
  }

  return (
    <div className="flex items-center gap-1 md:gap-2 text-white font-bold text-sm md:text-lg">
      
      {timeLeft.days > 0 && (
        <>
          <div className="bg-white text-[#FF5E4D] px-2 py-1 rounded shadow-sm min-w-[30px] text-center">
            {formatNumber(timeLeft.days)}
          </div>
          <span>:</span>
        </>
      )}

      <div className="bg-white text-[#FF5E4D] px-2 py-1 rounded shadow-sm min-w-[30px] text-center">
        {formatNumber(timeLeft.hours)}
      </div>
      <span>:</span>
      <div className="bg-white text-[#FF5E4D] px-2 py-1 rounded shadow-sm min-w-[30px] text-center">
        {formatNumber(timeLeft.minutes)}
      </div>
      <span>:</span>
      <div className="bg-white text-[#FF5E4D] px-2 py-1 rounded shadow-sm min-w-[30px] text-center">
        {formatNumber(timeLeft.seconds)}
      </div>
    </div>
  );
}