/**
 * 課程相關 API 服務
 */
import api from '@/lib/api';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  creator_id: string;
  creator_name: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  created_at: string;
}

export interface CourseDetail extends Course {
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  order: number;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  duration: number;
  order: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export const courseService = {
  /**
   * 取得課程列表
   */
  async getCourses(params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Course>> {
    const response = await api.get('/api/v1/courses', { params });
    return response.data;
  },

  /**
   * 取得課程詳情
   */
  async getCourseDetail(courseId: string): Promise<CourseDetail> {
    const response = await api.get(`/api/v1/courses/${courseId}`);
    return response.data;
  },

  /**
   * 建立課程 (講師用)
   */
  async createCourse(data: {
    title: string;
    description: string;
    price: number;
  }): Promise<Course> {
    const response = await api.post('/api/v1/courses', data);
    return response.data;
  },
};

export default courseService;
