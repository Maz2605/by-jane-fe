"use client"; // <--- BẮT BUỘC PHẢI CÓ

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export default function RichText({ content }: { content: BlocksContent }) {
  if (!content) return null;

  return (
    <div className="rich-text-content">
      <BlocksRenderer
        content={content}
        blocks={{
          // 1. Custom Ảnh: Dùng Next Image để tối ưu và fix lỗi hiển thị
          image: ({ image }) => (
            <div className="my-8 relative w-full aspect-video md:aspect-[2/1] rounded-xl overflow-hidden bg-gray-50 shadow-sm">
              <Image
                src={image.url}
                alt={image.alternativeText || "Article Image"}
                fill
                className="object-cover"
                unoptimized // Quan trọng để tránh lỗi hostname khi dev
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs text-center">
                    {image.caption}
                </div>
              )}
            </div>
          ),
          // 2. Custom Link: Màu đỏ, đậm
          link: ({ children, url }) => (
            <Link href={url} className="text-red-600 hover:underline font-medium hover:text-red-800 transition-colors">
              {children}
            </Link>
          ),
          // 3. Custom Quote
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-600 my-6 bg-gray-50 py-2 pr-2 rounded-r">
                {children}
            </blockquote>
          )
        }}
      />
    </div>
  );
}