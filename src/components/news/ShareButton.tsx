"use client";

import React, { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Tự động lấy domain hiện tại (localhost hoặc domain thật)
    const url = `${window.location.origin}/blog/${slug}`;

    // CÁCH 1: Dùng Web Share API (Cho Mobile & Trình duyệt hỗ trợ)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Đọc bài viết này hay lắm: ${title}`,
          url: url,
        });
      } catch (error) {
        // Người dùng hủy share thì không làm gì
        console.log("User cancelled share");
      }
    } 
    // CÁCH 2: Fallback cho PC (Copy Link)
    else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        // Reset trạng thái sau 2 giây
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Không thể copy link. Bạn hãy copy thủ công trên thanh địa chỉ nhé!");
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`
        flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide transition-all duration-300
        border-2 px-5 py-2 rounded-full active:scale-95
        ${copied 
            ? "border-green-500 text-green-600 bg-green-50" 
            : "border-gray-100 text-gray-600 hover:border-red-600 hover:text-red-600"
        }
      `}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Link Copied!" : "Share Post"}
    </button>
  );
}