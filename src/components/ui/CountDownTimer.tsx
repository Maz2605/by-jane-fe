"use client";
import { useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu nhận vào
interface CountDownTimerProps {
  targetDate: string; // Ví dụ: "2025-12-31T23:59:59"
}

export default function CountDownTimer({ targetDate }: CountDownTimerProps) {
  
  const calculateTimeLeft = () => {
    // Lấy ngày đích trừ đi ngày hiện tại
    const difference = +new Date(targetDate) - +new Date(); 
    
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

  return (
    <div className="flex items-center gap-1 md:gap-2 text-white font-bold text-sm md:text-lg">
      
      {/* Thêm phần Ngày (nếu muốn sale dài ngày) */}
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