// src/types/news.ts

export interface Article {
  id: number;
  title: string;
  slug: string;
  description?: string; // Sapo (cho bài to)
  content?: string;
  coverImage: string;
  author: string;
  publishedDate: string;
  mediaType: 'standard' | 'video'; // Cờ đánh dấu bài video
  videoFile?: string; // Link video (nếu có)
}

export interface Banner {
  id: number;
  title: string;
  subTitle: string;
  coverImage: string;
  link: string;
}