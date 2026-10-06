import { Comment } from './comment.model';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  comments?: Comment[];
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}