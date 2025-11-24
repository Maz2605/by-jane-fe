interface SectionTitleProps {
  title: string; // Đây là biến số: Chữ sẽ thay đổi
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 w-full">
      
      {/* Cụm bên trái: Dòng kẻ + Hình thoi */}
      <div className="flex items-center flex-1 justify-end gap-1">
        <div className="h-px w-12 md:w-32 bg-[#FF5E4D]"></div>
        <div className="w-1.5 h-1.5 bg-[#FF5E4D] rotate-45"></div>
      </div>

      {/* Dòng chữ ở giữa (Nhận từ Props) */}
      <h2 className="text-xl md:text-2xl font-bold text-[#FF5E4D] uppercase tracking-wider px-4 text-center">
        {title}
      </h2>

      {/* Cụm bên phải: Hình thoi + Dòng kẻ */}
      <div className="flex items-center flex-1 justify-start gap-1">
        <div className="w-1.5 h-1.5 bg-[#FF5E4D] rotate-45"></div>
        <div className="h-[1px] w-12 md:w-32 bg-[#FF5E4D]"></div>
      </div>

    </div>
  );
}