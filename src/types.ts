export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  social_image_url: string | null;
  published_at: string;
  views: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  categories?: Category;
  post_tags?: { tags: Tag }[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}